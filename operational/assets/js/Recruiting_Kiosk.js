/*
 * STUDENT KIOSK
 * -------------
 * This file controls selecting the CSV, validating a submission,
 * writing a record, and clearing the form for the next student.
 * Routine wording, brand colors and limits belong in Recruiting_Config.js.
 *
 * NOTE: This local-file workflow is NOT an authenticated or encrypted data
 * store. Only use it with real student information if expressly authorized.
 */
"use strict";

window.applyRecruitingConfig();
const kioskConfig = window.RECRUITING_CONFIG;

// KEEP IN SYNC with the column order in Recruiting_Manager.js and the CSV.
const KIOSK_HEADERS = [
  "Submission ID", "Submitted At", "First Name", "Last Name", "Phone",
  "Email", "Date of Birth", "Graduation Year", "Text Consent",
  "Contact Status", "Source", "Email Status"
];

let leadFileHandle = null;
const kioskEl = (id) => document.getElementById(id);

function showKioskPanel(id) {
  ["setup", "formCard", "success"].forEach((panel) => {
    kioskEl(panel).classList.toggle("hidden", panel !== id);
  });
}

// Guard against spreadsheet formula injection when opened with Excel.
function escapeKioskCSVCell(value) {
  let content = String(value ?? "").replace(/[\r\n\t]+/g, " ").trim();
  if (/^[\s]*[=+@-]/.test(content)) content = "'" + content;
  return /[",\r\n]/.test(content)
    ? '"' + content.replace(/"/g, '""') + '"'
    : content;
}

function serializeKioskCSV(rows) {
  return [KIOSK_HEADERS, ...rows]
    .map((row) => row.map(escapeKioskCSVCell).join(","))
    .join("\r\n") + "\r\n";
}

// Parse quoted commas and double quotes correctly. Never split a CSV row
// with a simple String.split(",").
function parseKioskCSV(text) {
  text = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (insideQuotes && text[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(value);
      if (row.some((field) => field !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value.length || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

async function loadKioskRows() {
  const file = await leadFileHandle.getFile();
  const rows = parseKioskCSV(await file.text());
  // Old versions had eleven columns. Add Email Status when first saved,
  // preserving all existing records and SMS statuses.
  const legacyHeaders = KIOSK_HEADERS.slice(0, -1);
  const header = rows[0] || [];
  const modern = KIOSK_HEADERS.every((value, index) => header[index] === value) && header.length === KIOSK_HEADERS.length;
  const legacy = legacyHeaders.every((value, index) => header[index] === value) && header.length === legacyHeaders.length;
  if (!modern && !legacy) {
    throw new Error("This file has different columns. Choose " + kioskConfig.data.expectedFileName + ".");
  }
  return rows.slice(1).filter((row) => row.some(Boolean)).map((row) =>
    legacy ? [...row.slice(0, 11), "New"] : [...row.slice(0, 11), row[11] || "New"]
  );
}

async function saveKioskRows(rows) {
  let permission = await leadFileHandle.queryPermission({ mode: "readwrite" });
  if (permission !== "granted") {
    permission = await leadFileHandle.requestPermission({ mode: "readwrite" });
  }
  if (permission !== "granted") throw new Error("Permission to update the lead file was not granted.");

  const writer = await leadFileHandle.createWritable();
  try {
    // UTF-8 BOM improves compatibility with Microsoft Excel.
    await writer.write("\uFEFF" + serializeKioskCSV(rows));
    await writer.close();
  } catch (error) {
    try { await writer.abort(); } catch (_) { /* Original failure is more useful */ }
    throw error;
  }
}

function showKioskError(id, error) {
  kioskEl(id).textContent = error.message || String(error);
  kioskEl(id).classList.remove("hidden");
}

// STAFF SETUP: connect to the exact CSV to be updated. The selected handle
// stays only in memory while this browser tab is open.
kioskEl("connect").addEventListener("click", async () => {
  kioskEl("setupError").classList.add("hidden");
  try {
    if (!window.showOpenFilePicker) {
      throw new Error("Use a recent desktop version of Microsoft Edge or Chrome to edit a local CSV.");
    }
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      types: [{ description: "Excel-compatible CSV", accept: { "text/csv": [".csv"] } }]
    });
    leadFileHandle = handle;
    await loadKioskRows();
    showKioskPanel("formCard");
    kioskEl("first").focus();
  } catch (error) {
    if (error.name !== "AbortError") showKioskError("setupError", error);
  }
});

// KIOSK FORM: validate, check exact duplicate, append record and reset.
kioskEl("interestForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = kioskEl("submitBtn");
  kioskEl("error").classList.add("hidden");

  const first = kioskEl("first").value.trim();
  const last = kioskEl("last").value.trim();
  const phone = kioskEl("phone").value.replace(/\D/g, "");
  const email = kioskEl("email").value.trim();
  const dob = kioskEl("dob").value;
  const grad = kioskEl("grad").value;

  try {
    if (!/^[\p{L}][\p{L} .'-]{0,59}$/u.test(first) ||
        !/^[\p{L}][\p{L} .'-]{0,59}$/u.test(last)) {
      throw new Error("Check the spelling of the first and last name.");
    }
    if (phone.length !== 10) throw new Error("Enter a 10-digit U.S. phone number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Enter a valid email address.");
    }

    const birthDate = new Date(dob + "T00:00:00");
    if (!dob || Number.isNaN(birthDate.getTime()) ||
        birthDate > new Date() || birthDate.getFullYear() < 1900) {
      throw new Error("Enter a valid date of birth.");
    }
    const minYear = kioskConfig.data.minGraduationYear;
    const maxYear = kioskConfig.data.maxGraduationYear;
    if (!/^\d{4}$/.test(grad) || Number(grad) < minYear || Number(grad) > maxYear) {
      throw new Error("Enter a four-digit graduation year.");
    }
    if (!kioskEl("consent").checked) {
      throw new Error("You must agree to be contacted before submitting.");
    }

    button.disabled = true;
    button.textContent = "Saving...";
    const records = await loadKioskRows();
    const isDuplicate = records.some((row) =>
      row[2].toLowerCase() === first.toLowerCase() &&
      row[3].toLowerCase() === last.toLowerCase() &&
      row[4].replace(/\D/g, "") === phone
    );

    if (!isDuplicate) {
      const submissionId = Date.now() + "-" + Math.floor(Math.random() * 1e6);
      records.push([
        submissionId, new Date().toISOString(), first, last, phone, email,
        dob, grad, "Yes", "New", kioskConfig.data.sourceLabel, "New"
      ]);
      await saveKioskRows(records);
    }

    kioskEl("interestForm").reset();
    showKioskPanel("success");
    window.setTimeout(() => {
      if (!kioskEl("success").classList.contains("hidden")) {
        showKioskPanel("formCard");
        kioskEl("first").focus();
      }
    }, kioskConfig.data.successScreenMilliseconds);
  } catch (error) {
    showKioskError("error", error);
  } finally {
    button.disabled = false;
    button.textContent = "Submit my information →";
  }
});

kioskEl("next").addEventListener("click", () => {
  showKioskPanel("formCard");
  kioskEl("first").focus();
});

// Keep the HTML number input boundaries aligned with configured validation.
kioskEl("grad").min = kioskConfig.data.minGraduationYear;
kioskEl("grad").max = kioskConfig.data.maxGraduationYear;
