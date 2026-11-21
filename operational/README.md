# Operational build (non-demo) — approval required before using real data

This is the original v7 **working CSV-based** kiosk and staff dashboard with no demo storage adapter. All student records are written to a staff-selected local CSV file via the browser File System Access API, not to GitHub.

## Setup on a permitted machine

1. Obtain written organizational/IT approval for this application, storage location, data collection and SMS/QR transfer process. The app is not currently an authorized government information system.
2. Place this entire `operational` folder in an authorized location, and make an authorized copy of `Recruiting_Leads_EMPTY.csv` named **`Recruiting_Leads.csv`** in an approved storage folder. Do not commit, email to personal accounts, or publish that file.
3. In recent desktop Edge/Chrome, open `Recruiting_Intake_Kiosk.html`. Select the CSV file and test with fictitious entries first.
4. Open `Recruiting_Staff_Manager.html` and select the same CSV. CSV is not automatically synced to the optional Excel reporting workbook.
5. Follow the v7 staff workflow for QR batches: scan `FirstName|PhoneNumber` lines with the iPhone Shortcut, review actual sends, then confirm the successful recipients on the dashboard to mark them Contacted. Scanning alone does not record deliveries.

The application has **no login, no encryption and no server backend**; File System Access might be restricted by government browser policy. If approved internal hosting is later available, these static sources may be adapted for it, subject to security and privacy review. Do not use public GitHub Pages as the operational database or assume that code availability equals approval. Student privacy notices and consent requirements still apply.

The empty CSV template is deliberately named `Recruiting_Leads_EMPTY.csv` so a future push cannot overwrite any saved records. Keep all live CSV records outside this repository.


EMAIL FOLLOW-UP
The staff manager can copy a BCC-only list of unique, opted-in email addresses
or download a FirstName,LastName,Email,GraduationYear mail-merge CSV. Email
contact status is tracked separately from text outreach. Confirm actual sends
before marking Emailed, then save changes. No emails are sent by the tool.
Existing 11-column lead CSV files migrate to the 12-column schema on save.
