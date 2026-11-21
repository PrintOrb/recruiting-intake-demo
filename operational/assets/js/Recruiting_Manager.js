/*
 * RECRUITER DASHBOARD
 * -------------------
 * Open a lead CSV, filter records, mark contact status, generate the
 * FirstName|PhoneNumber text export and show locally generated QR batches.
 *
 * Customize branding and QR batch size in Recruiting_Config.js.
 * Offline_QR.js is a third-party QR library: leave it unchanged.
 */
"use strict";

window.applyRecruitingConfig();
const managerConfig = window.RECRUITING_CONFIG;

// MUST match the kiosk's CSV column order (and the provided empty CSV file).
const MANAGER_HEADERS = [
  "Submission ID", "Submitted At", "First Name", "Last Name", "Phone",
  "Email", "Date of Birth", "Graduation Year", "Text Consent",
  "Contact Status", "Source", "Email Status"
];

let leadHandle = null;
let sourceCSV = null; // Snapshot of the file when loaded / last written.
let leadRecords = [];
let selectedLeads = new Set();
let unsavedChanges = false;
let qrBatches = [];
let qrBatchIndex = 0;
let qrBatchConfirmed = new Set(); // IDs checked by staff as successfully sent.
const managerEl = (id) => document.getElementById(id);

// CSV helpers: handle commas and quoted values rather than splitting on commas.
function parseManagerCSV(text) {
  text = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(value);
      if (row.some((field) => field !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (row.length || value) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

function escapeManagerCSVCell(value) {
  let cell = String(value ?? "").replace(/[\r\n\t]+/g, " ").trim();
  if (/^\s*[=+@-]/.test(cell)) cell = "'" + cell;
  return /[",]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell;
}

function serializeManagerCSV() {
  return "\uFEFF" + [MANAGER_HEADERS, ...leadRecords]
    .map((row) => row.map(escapeManagerCSVCell).join(","))
    .join("\r\n") + "\r\n";
}

function showManagerMessage(message, style = "ok") {
  managerEl("message").textContent = message;
  managerEl("message").className = style;
}

const normalizePhone = (record) => (record[4] || "").replace(/\D/g, "");

function countPhoneNumbers() {
  const counts = new Map();
  for (const record of leadRecords) {
    const phone = normalizePhone(record);
    if (phone) counts.set(phone, (counts.get(phone) || 0) + 1);
  }
  return counts;
}

// Eligibility rules are deliberately conservative. Do not export a lead
// without explicit recorded consent, with a shared phone, or once contacted.
function eligibleForText() {
  const counts = countPhoneNumbers();
  return leadRecords.filter((record) =>
    record[8] === "Yes" &&
    record[9] === "New" &&
    record[2] &&
    normalizePhone(record).length === 10 &&
    counts.get(normalizePhone(record)) === 1
  );
}

// Email outreach is tracked separately from SMS. Exclude invalid or shared
// addresses and records without explicit recorded contact consent.
const normalizeEmail = (record) => (record[5] || "").trim().toLowerCase();
function eligibleForEmail() {
  const counts = new Map();
  for (const record of leadRecords) {
    const email = normalizeEmail(record);
    if (email) counts.set(email, (counts.get(email) || 0) + 1);
  }
  return leadRecords.filter((record) => {
    const email = normalizeEmail(record);
    return record[8] === "Yes" && (record[11] || "New") === "New" &&
      record[2] && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && counts.get(email) === 1;
  });
}


// Derived only for the staff dashboard. DOB stays unchanged in the CSV.
// Age follows the local calendar date. Feb 29 birthdays are shown as Mar 1
// in non-leap years for display, not for legal eligibility decisions.

function birthdayInformation(dob, today = new Date()) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dob || ""));
  if (!match) return null;
  const birthYear = Number(match[1]);
  const birthMonth = Number(match[2]);
  const birthDay = Number(match[3]);
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  if (birthYear < 1900 || birthDate.getFullYear() !== birthYear ||
      birthDate.getMonth() !== birthMonth - 1 || birthDate.getDate() !== birthDay) return null;
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (birthDate > now) return null;
  const observedBirthday = (year) => {
    const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return birthMonth === 2 && birthDay === 29 && !isLeap
      ? new Date(year, 2, 1)
      : new Date(year, birthMonth - 1, birthDay);
  };
  let next = observedBirthday(now.getFullYear());
  const thisYearsBirthday = next;
  if (next < now) next = observedBirthday(now.getFullYear() + 1);
  const age = now.getFullYear() - birthYear - (now < thisYearsBirthday ? 1 : 0);
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const nextUTC = Date.UTC(next.getFullYear(), next.getMonth(), next.getDate());
  const daysUntil = Math.round((nextUTC - todayUTC) / 86400000);
  const birthdayLabel = birthDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const nextLabel = next.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {age,birthdayLabel,nextLabel,daysUntil,turningAge:next.getFullYear()-birthYear};
}

function renderUpcomingBirthdays(today) {
  const upcoming = leadRecords.map((record) => ({
    record, info: birthdayInformation(record[6], today)
  })).filter((entry) => entry.info && entry.info.daysUntil <= 30)
    .sort((a,b) => a.info.daysUntil-b.info.daysUntil ||
      String(a.record[2]).localeCompare(String(b.record[2])));
  managerEl("birthdayCount").textContent = String(upcoming.length);
  managerEl("birthdaySummary").textContent = upcoming.length
    ? `${upcoming.length} in the next 30 days` : "None in the next 30 days";
  const list=managerEl("birthdayList");
  list.replaceChildren();
  if (!upcoming.length) {
    const empty=document.createElement("p");
    empty.className="muted";
    empty.textContent="No upcoming birthdays in the next 30 days.";
    list.append(empty);return;
  }
  for (const {record,info} of upcoming.slice(0,10)) {
    const item=document.createElement("div");
    item.className="birthday-item";
    const identity=document.createElement("div");
    identity.className="birthday-person";
    const name=document.createElement("strong");
    name.textContent=`${record[2]} ${record[3]}`.trim();
    const detail=document.createElement("span");
    detail.textContent=`Turns ${info.turningAge} · ${info.nextLabel}`;
    identity.append(name,detail);
    const badge=document.createElement("span");
    badge.className="birthday-pill"+(info.daysUntil===0?" birthday-today":"");
    badge.textContent=info.daysUntil===0?"TODAY":`IN ${info.daysUntil} ${info.daysUntil===1?"DAY":"DAYS"}`;
    item.append(identity,badge);
    list.append(item);
  }
  if(upcoming.length>10){
    const remaining=document.createElement("p");
    remaining.className="muted";
    remaining.textContent=`And ${upcoming.length-10} more — see the birthday column in the lead table.`;
    list.append(remaining);
  }
}

// Render with textContent, never row.innerHTML (records are untrusted input).
function renderDashboard() {
  const counts = countPhoneNumbers();
  const eligible = eligibleForText();
  const emailEligible = eligibleForEmail();
  const today = new Date();
  renderUpcomingBirthdays(today);
  const validAges = leadRecords.map(record => birthdayInformation(record[6], today))
    .filter(Boolean).map(info => info.age);
  managerEl("averageAge").textContent = validAges.length
    ? (validAges.reduce((sum, age) => sum + age, 0) / validAges.length).toFixed(1)
    : "—";

  managerEl("total").textContent = leadRecords.length;
  managerEl("eligible").textContent = eligible.length;
  managerEl("contacted").textContent = leadRecords.filter((r) => r[9] === "Contacted").length;
  managerEl("duplicates").textContent = leadRecords.filter((r) => counts.get(normalizePhone(r)) > 1).length;
  managerEl("emailEligible").textContent = emailEligible.length;
  managerEl("emailed").textContent = leadRecords.filter((r) => r[11] === "Emailed").length;
  managerEl("emailAddresses").value = emailEligible.map(normalizeEmail).join("; ");
  managerEl("emailCount").textContent = emailEligible.length + " unique addresses ready for follow-up";

  // IMPORTANT: iPhone Shortcut consumes FirstName|PhoneNumber, one per line.
  managerEl("smsText").value = eligible.map((record) =>
    record[2].trim().split(/\s+/)[0] + managerConfig.sms.separator + normalizePhone(record)
  ).join("\n");

  const search = managerEl("search").value.toLowerCase().trim();
  const tableBody = managerEl("rows");
  tableBody.replaceChildren();
  let shown = 0;

  leadRecords.forEach((record, index) => {
    const searchable = `${record[2]} ${record[3]} ${normalizePhone(record)} ${normalizeEmail(record)}`.toLowerCase();
    if (search && !searchable.includes(search)) return;
    shown++;

    const tableRow = document.createElement("tr");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selectedLeads.has(index);
    checkbox.setAttribute("aria-label", "Select " + `${record[2]} ${record[3]}`.trim());
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selectedLeads.add(index);
      else selectedLeads.delete(index);
      managerEl("countSelected").textContent = selectedLeads.size + " selected";
    });

    const selectCell = document.createElement("td");
    selectCell.append(checkbox);
    tableRow.append(selectCell);

    const appendCell = (value) => {
      const cell = document.createElement("td");
      cell.textContent = value || "—";
      tableRow.append(cell);
    };

    appendCell(`${record[2]} ${record[3]}`.trim());
    appendCell(record[4]);
    appendCell(record[5]);
    const birthday=birthdayInformation(record[6],today);
    appendCell(birthday ? String(birthday.age) : "—");
    const birthdayCell=document.createElement("td");
    if(birthday){
      const dateLabel=document.createElement("span");
      dateLabel.textContent=birthday.birthdayLabel;
      birthdayCell.append(dateLabel);
      if(birthday.daysUntil<=30){
        const note=document.createElement("span");
        note.className="birthday-inline-note";
        note.textContent=birthday.daysUntil===0?"Today":`In ${birthday.daysUntil}d`;
        birthdayCell.append(note);
      }
    } else {birthdayCell.textContent="—";}
    tableRow.append(birthdayCell);
    appendCell(record[7]);

    const consentCell = document.createElement("td");
    const consentTag = document.createElement("span");
    consentTag.className = "tag " + (record[8] === "Yes" ? "" : "no");
    consentTag.textContent = record[8] === "Yes" ? "Yes" : "No";
    consentCell.append(consentTag);
    tableRow.append(consentCell);

    const statusCell = document.createElement("td");
    const statusTag = document.createElement("span");
    statusTag.className = "tag " + (record[9] === "Contacted" ? "done" : "");
    statusTag.textContent = record[9] || "New";
    statusCell.append(statusTag);
    tableRow.append(statusCell);

    const emailStatusCell = document.createElement("td");
    const emailStatusTag = document.createElement("span");
    emailStatusTag.className = "tag " + (record[11] === "Emailed" ? "done" : "");
    emailStatusTag.textContent = record[11] || "New";
    emailStatusCell.append(emailStatusTag);
    tableRow.append(emailStatusCell);

    appendCell(counts.get(normalizePhone(record)) > 1 ? "Shared phone" : "—");
    appendCell((record[1] || "").slice(0, 10));
    tableBody.append(tableRow);
  });

  if (!shown) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 12;
    cell.textContent = "No records match.";
    row.append(cell);
    tableBody.append(row);
  }

  managerEl("countSelected").textContent = selectedLeads.size + " selected";
  managerEl("save").disabled = !unsavedChanges;
}

// Open the same CSV selected during the student intake session.
managerEl("open").addEventListener("click", async () => {
  try {
    if (!window.showOpenFilePicker) {
      throw new Error("Use a recent desktop version of Microsoft Edge or Chrome with local file access.");
    }
    const [fileHandle] = await window.showOpenFilePicker({
      multiple: false,
      types: [{ description: "CSV file", accept: { "text/csv": [".csv"] } }]
    });
    const file = await fileHandle.getFile();
    const fileText = await file.text();
    const parsed = parseManagerCSV(fileText);
    const header = parsed[0] || [];
    const modern = header.length === MANAGER_HEADERS.length && MANAGER_HEADERS.every((column, index) => header[index] === column);
    const legacy = header.length === MANAGER_HEADERS.length - 1 &&
      MANAGER_HEADERS.slice(0, -1).every((column, index) => header[index] === column);
    if (!modern && !legacy) {
      throw new Error("The CSV headers do not match " + managerConfig.data.expectedFileName + ".");
    }
    leadHandle = fileHandle;
    sourceCSV = fileText;
    leadRecords = parsed.slice(1).filter((row) => row.some(Boolean))
      .map((row) => [...row.slice(0, 11), legacy ? "New" : (row[11] || "New")]);
    selectedLeads.clear();
    unsavedChanges = false;
    managerEl("fileName").textContent = file.name;
    managerEl("app").classList.remove("hidden");
    managerEl("message").className = "hidden";
    renderDashboard();
  } catch (error) {
    if (error.name !== "AbortError") showManagerMessage(error.message, "err");
  }
});

managerEl("search").addEventListener("input", renderDashboard);

managerEl("selectAll").addEventListener("change", (event) => {
  const search = managerEl("search").value.toLowerCase().trim();
  leadRecords.forEach((record, index) => {
    const searchable = `${record[2]} ${record[3]} ${normalizePhone(record)} ${normalizeEmail(record)}`.toLowerCase();
    if (!search || searchable.includes(search)) {
      if (event.target.checked) selectedLeads.add(index);
      else selectedLeads.delete(index);
    }
  });
  renderDashboard();
});

for (const [buttonId, nextStatus] of [["markDone", "Contacted"], ["markNew", "New"]]) {
  managerEl(buttonId).addEventListener("click", () => {
    if (!selectedLeads.size) return showManagerMessage("Select one or more leads first.", "err");
    for (const index of selectedLeads) leadRecords[index][9] = nextStatus;
    selectedLeads.clear();
    unsavedChanges = true;
    managerEl("selectAll").checked = false;
    renderDashboard();
    showManagerMessage("Status updated locally. Click Save status changes to CSV to persist it.");
  });
}

// Staff must confirm email delivery through their approved mail system.
// Copying an address or downloading mail merge data does NOT mark it emailed.
for (const [buttonId, emailStatus] of [["markEmailed", "Emailed"], ["markEmailNew", "New"]]) {
  managerEl(buttonId).addEventListener("click", () => {
    if (!selectedLeads.size) return showManagerMessage("Select one or more leads first.", "err");
    if (emailStatus === "Emailed" && !window.confirm(
      `Confirm email was actually sent to all ${selectedLeads.size} selected leads through an approved mail system?`
    )) return;
    for (const index of selectedLeads) leadRecords[index][11] = emailStatus;
    selectedLeads.clear();
    unsavedChanges = true;
    managerEl("selectAll").checked = false;
    renderDashboard();
    showManagerMessage("Email follow-up status updated locally. Click Save changes to CSV to persist it.");
  });
}

function escapeEmailExportCell(value) {
  const cell = String(value ?? "").replace(/[\r\n\t]+/g, " ").trim();
  const safe = /^[=+@-]/.test(cell) ? "'" + cell : cell;
  return /[",]/.test(safe) ? '"' + safe.replace(/"/g, '""') + '"' : safe;
}

managerEl("copyEmails").addEventListener("click", async () => {
  const emails = managerEl("emailAddresses").value;
  if (!emails) return showManagerMessage("No eligible unique email addresses to copy.", "err");
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(emails);
    else {
      managerEl("emailAddresses").focus();
      managerEl("emailAddresses").select();
      if (!document.execCommand("copy")) throw new Error("Copy unavailable");
    }
    showManagerMessage("Copied addresses. Use BCC only in an approved mail account; copying does not mark recipients Emailed.");
  } catch (error) {
    showManagerMessage("Copy unavailable. Select the BCC addresses and copy manually.", "err");
  }
});

managerEl("emailCSV").addEventListener("click", () => {
  const eligible = eligibleForEmail();
  if (!eligible.length) return showManagerMessage("No eligible unique emails for a mail merge.", "err");
  const rows = [["FirstName", "LastName", "Email", "GraduationYear"], ...eligible.map((r) => [
    r[2], r[3], normalizeEmail(r), r[7]
  ])];
  const csv = "\uFEFF" + rows.map((row) => row.map(escapeEmailExportCell).join(",")).join("\r\n") + "\r\n";
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "Recruiting_Email_Mail_Merge.csv";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showManagerMessage("Mail-merge CSV prepared with names, email, and graduation year only. Check the approved mail system before importing.");
});

// Save to the existing CSV. Refuse to overwrite changes made after it was opened.
// The browser's file permission is local; the file itself has no authentication.
async function persistManagerRecords() {
  if (!leadHandle) throw new Error("Open a CSV file first.");
  let permission = await leadHandle.queryPermission({ mode: "readwrite" });
  if (permission !== "granted") permission = await leadHandle.requestPermission({ mode: "readwrite" });
  if (permission !== "granted") throw new Error("Write permission was not granted.");

  const currentText = await (await leadHandle.getFile()).text();
  if (sourceCSV !== currentText) {
    throw new Error("The CSV changed outside this page. Reopen the file to avoid losing newer submissions.");
  }

  const output = serializeManagerCSV();
  const writer = await leadHandle.createWritable();
  try {
    await writer.write(output);
    await writer.close();
  } catch (error) {
    try { await writer.abort(); } catch (_) { /* Preserve original write error. */ }
    throw error;
  }
  sourceCSV = output;
  unsavedChanges = false;
  renderDashboard();
}

managerEl("save").addEventListener("click", async () => {
  try {
    await persistManagerRecords();
    showManagerMessage("Contact statuses saved to the CSV file.");
  } catch (error) {
    showManagerMessage(error.message, "err");
  }
});

// Permanently remove selected leads, including any hidden by the search filter.
// Only selected rows are deleted. Nothing is written unless the staff member confirms.
managerEl("deleteSelected").addEventListener("click", async () => {
  if (!selectedLeads.size) return showManagerMessage("Select at least one record to delete.", "err");
  const count = selectedLeads.size;
  if (!window.confirm(`Permanently delete ${count} selected lead${count === 1 ? "" : "s"} from the CSV?\n\nThis cannot be undone here. Make an approved backup first if needed.`)) return;

  const original = leadRecords;
  const oldSelection = selectedLeads;
  const oldUnsaved = unsavedChanges;
  leadRecords = leadRecords.filter((record, index) => !selectedLeads.has(index));
  selectedLeads = new Set();
  managerEl("selectAll").checked = false;
  unsavedChanges = true;
  try {
    await persistManagerRecords();
    showManagerMessage(`${count} selected lead${count === 1 ? "" : "s"} permanently removed from the CSV.`);
  } catch (error) {
    leadRecords = original;
    selectedLeads = oldSelection;
    unsavedChanges = oldUnsaved;
    renderDashboard();
    showManagerMessage("Deletion was not saved: " + error.message, "err");
  }
});

managerEl("copy").addEventListener("click", async () => {
  const text = managerEl("smsText").value;
  if (!text) return showManagerMessage("There are no eligible new leads to copy.", "err");
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = managerEl("smsText");
      textarea.focus();
      textarea.select();
      if (!document.execCommand("copy")) throw new Error("Copy unavailable.");
    }
    showManagerMessage("Copied " + text.split("\n").length + " lead lines to this computer's clipboard.");
  } catch (_) {
    showManagerMessage("Copy failed. Select and copy the SMS list manually.", "err");
  }
});

// OFFLINE QR CODE
// Each batch contains the EXACT lines already visible in the SMS export.
function buildQRBatches() {
  // Freeze the exact eligible leads for each displayed QR, using submission ID
  // so marking does not accidentally affect unrelated table rows.
  const entries = eligibleForText().map((record) => ({
    id: record[0],
    phone: normalizePhone(record),
    name: record[2].trim().split(/\s+/)[0],
    line: record[2].trim().split(/\s+/)[0] + managerConfig.sms.separator + normalizePhone(record)
  }));
  const batches = [];
  const batchSize = Math.max(1, Math.floor(Number(managerConfig.sms.qrBatchSize) || 15));
  for (let i = 0; i < entries.length; i += batchSize) batches.push(entries.slice(i, i + batchSize));
  return batches;
}

// The computer cannot detect iPhone scans or successful sends without a separate,
// authorized network connection. This is an explicit staff confirmation action.
function renderQRChecklist() {
  const current = qrBatches[qrBatchIndex] || [];
  const panel = managerEl("qrChecklist");
  panel.replaceChildren();
  qrBatchConfirmed = new Set(current.map((entry) => entry.id));
  current.forEach((entry) => {
    const label = document.createElement("label");
    label.className = "qr-checkline";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = true;
    check.setAttribute("aria-label", "Message successfully sent to " + entry.name);
    check.addEventListener("change", () => {
      if (check.checked) qrBatchConfirmed.add(entry.id);
      else qrBatchConfirmed.delete(entry.id);
      updateQRActionLabel();
    });
    const name = document.createElement("span");
    name.textContent = `${entry.name} · ${entry.phone.slice(0,3)}-***-${entry.phone.slice(-4)}`;
    label.append(check, name);
    panel.append(label);
  });
  updateQRActionLabel();
}

function updateQRActionLabel() {
  const count = qrBatchConfirmed.size;
  managerEl("qrMarkSent").disabled = count === 0;
  managerEl("qrMarkSent").textContent = `Confirm ${count} sent · mark contacted`;
  managerEl("qrChecklistCount").textContent = `${count} of ${(qrBatches[qrBatchIndex] || []).length} selected`;
}

function drawQRCode(text) {
  const qr = new OfflineQRCode(-1, OfflineQRErrorLevel.M);
  qr.addData(text);
  qr.make();
  const canvas = managerEl("qrCanvas");
  const context = canvas.getContext("2d");
  const modules = qr.getModuleCount();
  const quietZone = 4;
  const cellPixels = 6;
  canvas.width = canvas.height = (modules + quietZone * 2) * cellPixels;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#061323";
  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      if (qr.isDark(y, x)) {
        context.fillRect((x + quietZone) * cellPixels,
          (y + quietZone) * cellPixels, cellPixels, cellPixels);
      }
    }
  }
}

function showCurrentQRBatch() {
  managerEl("qrStatus").textContent = "";
  const batch = qrBatches[qrBatchIndex];
  if (!batch) return;
  try {
    drawQRCode(batch.map((entry) => entry.line).join("\n"));
    const start = qrBatches.slice(0, qrBatchIndex).reduce((sum, rows) => sum + rows.length, 0) + 1;
    const end = start + batch.length - 1;
    managerEl("qrBatch").textContent = `Batch ${qrBatchIndex + 1} of ${qrBatches.length} · ${batch.length} leads · records ${start}–${end}`;
    managerEl("qrPrev").disabled = qrBatchIndex === 0;
    managerEl("qrNext").disabled = qrBatchIndex === qrBatches.length - 1;
    renderQRChecklist();
  } catch (error) {
    managerEl("qrBatch").textContent = "This QR batch is too large to encode. Reduce qrBatchSize in Recruiting_Config.js.";
  }
}

function closeQRDialog() {
  managerEl("qrBackdrop").classList.add("hidden");
  const canvas = managerEl("qrCanvas");
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  qrBatches = [];
  qrBatchConfirmed.clear();
  managerEl("showQR").focus();
}

managerEl("showQR").addEventListener("click", () => {
  qrBatches = buildQRBatches();
  if (!qrBatches.length) return showManagerMessage("There are no eligible new leads to transfer.", "err");
  qrBatchIndex = 0;
  managerEl("qrBackdrop").classList.remove("hidden");
  showCurrentQRBatch();
  managerEl("closeQR").focus();
});
managerEl("qrPrev").addEventListener("click", () => {
  if (qrBatchIndex > 0) { qrBatchIndex--; showCurrentQRBatch(); }
});
managerEl("qrNext").addEventListener("click", () => {
  if (qrBatchIndex < qrBatches.length - 1) { qrBatchIndex++; showCurrentQRBatch(); }
});
managerEl("qrMarkSent").addEventListener("click", async () => {
  const batch = qrBatches[qrBatchIndex];
  if (!batch || qrBatchConfirmed.size === 0) return;
  const chosen = batch.filter((entry) => qrBatchConfirmed.has(entry.id));
  if (!window.confirm(
    `Confirm the iPhone actually sent ${chosen.length} individual text${chosen.length === 1 ? "" : "s"}?\n\n` +
    "Only checked recipients will be marked Contacted and saved to the CSV. Scanning the QR alone does not confirm sending."
  )) return;

  const originalRecords = leadRecords.map((row) => [...row]);
  const oldUnsaved = unsavedChanges;
  try {
    // Confirm that every chosen item is still an eligible and uniquely matched lead.
    const counts = countPhoneNumbers();
    for (const entry of chosen) {
      const matches = leadRecords.filter((row) => row[0] === entry.id && normalizePhone(row) === entry.phone);
      if (matches.length !== 1 || matches[0][8] !== "Yes" || matches[0][9] !== "New" ||
          counts.get(entry.phone) !== 1) {
        throw new Error("Lead data changed; no changes saved. Close this QR and reopen the CSV.");
      }
      matches[0][9] = "Contacted";
    }
    unsavedChanges = true;
    await persistManagerRecords();
    // Remove the completed QR batch so it cannot be inadvertently scanned twice.
    qrBatches.splice(qrBatchIndex, 1);
    if (qrBatches.length) {
      qrBatchIndex = Math.min(qrBatchIndex, qrBatches.length - 1);
      showCurrentQRBatch();
    } else {
      closeQRDialog();
    }
    showManagerMessage(`${chosen.length} confirmed sent lead${chosen.length === 1 ? "" : "s"} marked Contacted and saved to CSV. ` +
      "Reopen the QR window to regenerate a batch for any unchecked recipients.");
  } catch (error) {
    leadRecords = originalRecords;
    unsavedChanges = oldUnsaved;
    renderDashboard();
    showManagerMessage("Could not save batch: " + error.message, "err");
    managerEl("qrStatus").textContent = "Not saved: " + error.message;
  }
});
managerEl("closeQR").addEventListener("click", closeQRDialog);
managerEl("qrBackdrop").addEventListener("click", (event) => {
  if (event.target === managerEl("qrBackdrop")) closeQRDialog();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !managerEl("qrBackdrop").classList.contains("hidden")) {
    closeQRDialog();
  }
});
