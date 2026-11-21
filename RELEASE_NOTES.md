# Recruiting Intake System v1.1.0

**Standalone recruiting intake and lead-management system** — the downloadable,
non-demo edition. This version supersedes v1.0.0 and contains no actual student
records or demonstration leads.

## What's new since v1.0.0

- **Student kiosk:** automatically rotates three different real, credited
  public-domain U.S. military photos every 20 seconds, with a 1.8-second fade.
  Cleaned up the student page headline.
- **Recruiter dashboard:** automatically calculates each lead's current age,
  shows their birthday, and lists upcoming birthdays over the next 30 days.
  The unused average-age statistic was removed.
- **Email follow-up:** export unique, consented email addresses to a BCC list
  or download a mail-merge CSV. Email status is tracked separately from SMS.
- **Texting workflow:** retain name-and-number QR batches, SMS exports,
  and manual confirmation of recipients actually contacted.
- **iPhone Shortcut:** an install link and scannable installation QR code
  now point to the shared companion Recruiting Text Assistant on Apple iCloud.
  No recruiting lead data is embedded in the installation QR.

## Included in the download

- `Recruiting_Intake_Kiosk.html` — student intake form
- `Recruiting_Staff_Manager.html` — staff dashboard
- `iphone-shortcut.html` — iPhone Shortcut installation page
- `Recruiting_Leads.csv` — **blank, header-only** lead file
- `Recruiting_Excel_Tracker.xlsx` — blank Excel reporting workbook
- HTML, CSS, JavaScript, three official military photographs, photo credits,
  and staff documentation

**Public GitHub Pages demo files and sample lead records are not included.**

## Installation

1. Download **`Recruiting_Intake_System_v1.1.0.zip`** from the Assets section.
2. Extract the ZIP completely to an approved folder.
3. Open `Recruiting_Intake_Kiosk.html` in a compatible desktop Chrome/Edge
   browser and select the included `Recruiting_Leads.csv`.
4. Open `Recruiting_Staff_Manager.html` and select that **same** CSV.
5. For SMS follow-up, install and inspect the shared iPhone Shortcut through
   the dashboard's **Get iPhone Shortcut** link, and confirm actual texts
   after sending. For email, use an authorized email account.

The file format has twelve columns, including `Email Status`. The manager
can read older eleven-column records and add the status column on save.

## Important safety and operational limits

This is **not an approved U.S. Air Force information system**. Before collecting
any real student information—especially minors' information—obtain relevant
organizational, IT, privacy, device, storage, and consent approvals. The local
application does not provide logins or encryption. The publicly hosted demo
is for **fictional data only**. Never put real recruiting leads, DOBs, or
contact information on GitHub. Shortcut sharing is separate from device or
workflow approval.
