# Recruiting Intake System — Standalone Edition

**Independent prototype. Not an official U.S. Air Force application or an approved system for collecting real student records.**

This standalone edition reads and writes a staff-selected local CSV file. Unlike the public GitHub Pages demo, it does not contain preloaded fictional records.

## Setup

1. Obtain permission for the software, device/browser, records storage, consent/privacy notice and any iPhone/QR data transfers **before collecting real records**.
2. When downloading the release, extract the entire ZIP and use the included blank `Recruiting_Leads.csv`. When working directly from source, copy `Recruiting_Leads_EMPTY.csv` to that filename **outside GitHub**.
3. In supported desktop Edge/Chrome, open `Recruiting_Intake_Kiosk.html`, enter the school/event name once in staff setup, select the CSV, and test with fictional details.
4. Open `Recruiting_Staff_Manager.html` and select the **same** CSV.
5. Use the dashboard to view records, school, ages, birthdays, and SMS/email outreach. Enter a school and use **Assign to selected** or **Fill unassigned records** to bulk-set schools, then save. Confirm actual messages sent; scanning a QR alone does not update the file.
6. Use **Get iPhone Shortcut** for the companion installation page (iCloud requires internet); the kiosk photographs rotate offline.

## Key files

- `assets/js/Recruiting_Config.js` — branding, editable wording, photo rotation and Shortcut URL
- `assets/images/` and `PHOTO_CREDITS.md` — credited military photography
- `docs/CUSTOMIZATION_GUIDE.md` — maintenance instructions
- `docs/TESTING_CHECKLIST.md` — functional tests
- `docs/DEPLOYMENT_CHECKLIST.md` — pre-deployment authorization and privacy review
- `Recruiting_Excel_Tracker.xlsx` — optional **blank** workbook; not automatically synchronized with the CSV

Contact permission is optional at submission; records without affirmative consent are saved with `Text Consent = No` and excluded from both SMS and email exports. The CSV column name is retained for backward compatibility. The lead CSV has separate SMS and email statuses, plus an appended School column (13 total). The kiosk and manager accept older 11-/12-column CSVs and extend them on save; older school values initially remain blank. Ages and upcoming birthdays are calculated from stored DOB and are not written as duplicate fields.

**Limitations:** no login, encryption, or server backend. Managed-device policy may prevent local file access. Approval for student data and the mobile Shortcut workflow must be obtained independently. Never put real student records on GitHub or the public demonstration.
