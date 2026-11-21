## Recruiting Intake System — Standalone Download

This release is the downloadable **non-demo** student registration and recruiting lead-management application.

### In the download
- Student intake form with name, phone, email, date of birth, and graduation year
- Recruiter lead dashboard with editing, deletion, and contact-status tracking
- Offline QR generator, SMS export (`FirstName|PhoneNumber`), and batch confirmation
- **Blank, header-only** `Recruiting_Leads.csv` — no demonstration records
- Excel-compatible reporting workbook (also blank)
- Documentation and editable HTML, CSS, and JavaScript files

### Setup
Download the **`Recruiting_Intake_System_v1.0.0.zip` asset**, extract its entire contents, and open `Recruiting_Intake_Kiosk.html` in compatible desktop Edge or Chrome. Select the included blank `Recruiting_Leads.csv` file. Open the staff manager and select the same file when managing records.

This application is not an officially approved government information system. Before collecting real student information, obtain authorization for the device, storage, privacy notice, consent language, and any SMS/QR transfer. GitHub Pages and this repository do not store live leads.


- Added email follow-up: BCC address copy, personalized mail-merge CSV export,
  and independent Emailed/New tracking.
- Duplicate email addresses are excluded from the automated export for review.
- Existing eleven-column CSV databases remain readable and are extended with
  a new `Email Status` column when the next save is made.
- Email exports exclude phone numbers and date of birth. No email is sent by
  the application; use an authorized recruiting email account.

- The next build includes an automatic 20-second kiosk background slideshow, with a 1.8-second crossfade and editable photo treatments.
