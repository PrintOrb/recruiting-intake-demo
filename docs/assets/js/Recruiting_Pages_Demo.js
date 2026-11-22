/* PUBLIC GITHUB PAGES DEMO ONLY
 * The browser stores fictional demonstration leads locally. No real student
 * information should be entered. There is no backend or account login.
 * This adapter is intentionally NOT included in the offline production folder.
 */
(function () {
  'use strict';
  const KEY = 'recruiting-pages-demo-leads-v2';
  const HEADERS = 'Submission ID,Submitted At,First Name,Last Name,Phone,Email,Date of Birth,Graduation Year,Text Consent,Contact Status,Source,Email Status';
  const EXAMPLE_CSV = [
    HEADERS,
    'demo-alex,2026-11-21T16:00:00.000Z,Alex,Carter,2025550101,alex@example.com,2008-05-12,2027,Yes,New,Demo only,New',
    'demo-jordan,2026-11-21T16:00:00.000Z,Jordan,Lee,2025550102,jordan@example.com,2009-02-17,2028,Yes,New,Demo only,New',
    'demo-taylor,2026-11-21T16:00:00.000Z,Taylor,Reed,2025550103,taylor@example.com,2008-11-02,2027,Yes,New,Demo only,New'
  ].join('\r\n') + '\r\n';

  try {
    if (!window.localStorage.getItem(KEY)) window.localStorage.setItem(KEY, EXAMPLE_CSV);
  } catch (error) {
    console.warn('Browser storage is unavailable; demo data may not persist.', error);
  }
  let fallbackText = EXAMPLE_CSV;
  function read() {
    try { return window.localStorage.getItem(KEY) || fallbackText; }
    catch (error) { return fallbackText; }
  }
  function write(text) {
    fallbackText = text;
    try { window.localStorage.setItem(KEY, text); }
    catch (error) { console.warn('Demo saved for this tab only', error); }
  }
  function demoFileHandle() {
    return {
      name: 'Recruiting_Leads.csv',
      async getFile() { return { name: 'Recruiting_Leads.csv', async text() { return read(); } }; },
      async queryPermission() { return 'granted'; },
      async requestPermission() { return 'granted'; },
      async createWritable() {
        let buffer = '';
        return {
          async write(value) { buffer = String(value); },
          async close() { write(buffer); },
          async abort() { buffer = ''; }
        };
      }
    };
  }
  // The existing app still calls showOpenFilePicker, but this demo intentionally
  // operates on test records in this browser instead of requesting local files.
  window.showOpenFilePicker = async function () { return [demoFileHandle()]; };

  window.resetRecruitingDemo = function () {
    write(EXAMPLE_CSV);
    window.location.reload();
  };
  // Allow only the fictional 202-555-01xx number range and example.com email
  // addresses for demo submissions. Names and DOBs must likewise be invented.
  document.addEventListener('submit', function (event) {
    if (event.target.id !== 'interestForm') return;
    const phone = (document.getElementById('phone')?.value || '').replace(/\D/g, '');
    const email = (document.getElementById('email')?.value || '').trim().toLowerCase();
    if (/^20255501\d\d$/.test(phone) && /^[^\s@]+@example\.com$/.test(email)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const box = document.getElementById('error');
    if (box) {
      box.textContent = 'Public demo: use fictional values only. Phone: 202-555-01XX. Email: name@example.com.';
      box.classList.remove('hidden');
    }
  }, true);

  // Override demo-only text so the interface is not mistaken for an official
  // government collection system. The original local tool is unchanged.
  const config = window.RECRUITING_CONFIG;
  if (config) {
    config.brand.studentBadge = 'PUBLIC DEMONSTRATION';
    config.brand.staffBadge = 'DEMO DATA ONLY';
    config.kiosk.formDescription = 'Try the form with invented details only. Example: 202-555-0104 and alex@example.com.';
    config.kiosk.successDescription = 'Your fictional entry was added to this browser’s demo records. No information was submitted to the Air Force.';
    config.data.sourceLabel = 'Demo only';
  }
})();
