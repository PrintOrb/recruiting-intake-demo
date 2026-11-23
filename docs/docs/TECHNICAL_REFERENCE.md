# Technical reference

## Architecture

Plain static HTML/CSS/JavaScript (no server), writing to a **staff-selected local CSV** with the browser File System Access API. No browser local storage and no backend accounts. External QR generation calls are not made; the QR dependency is bundled as `assets/js/Offline_QR.js`. The Excel workbook is optional for manual reporting, not live-linked.

### Browser and file conditions

- Use desktop **Edge/Chrome** that supports `window.showOpenFilePicker()`.
- Run both HTML pages from the same extracted folder so relative assets load.
- On each new tab/session, staff selects the CSV again.
- Write access requires browser permission.
- CSV data is **plain text, not encrypted**. The browser does not enforce separate student/staff roles or secure the underlying disk.
- The kiosk and manager both **rewrite the full CSV** when saving. Never have them both writing simultaneously, and don't keep the CSV open in Excel while collecting.

## CSV schema (do not rearrange)

| Index (0-based) | CSV column | Stored meaning |
|---:|---|---|
| 0 | Submission ID | Generated timestamp/random identifier |
| 1 | Submitted At | ISO-8601 timestamp |
| 2 | First Name | Person's first name |
| 3 | Last Name | Person's last name |
| 4 | Phone | Ten-digit numeric string |
| 5 | Email | Contact email |
| 6 | Date of Birth | `YYYY-MM-DD` |
| 7 | Graduation Year | Four-digit year |
| 8 | Text Consent | `Yes` when intake checkbox is checked |
| 9 | Contact Status | `New` or `Contacted` |
| 10 | Source | Configured `data.sourceLabel` (origin category; **not** the school) |
| 11 | Email Status | `New` or `Emailed`, tracked independently of SMS |
| 12 | School | Staff-selected school or event name; blank for imported older leads |

The `Recruiting_Leads.csv` file is deliberately header-only. Do not put real student details into a test version.

## Kiosk save sequence

1. Staff types the school/event name once, then selects the existing lead CSV file.
2. Kiosk accepts the current 13-column headers or legacy 11-/12-column headers and upgrades the data on the next save.
3. Student enters name, phone, email, DOB, and graduation year; contact consent is optional. The school is not editable by the student.
4. Browser validates inputs: name characters, ten-digit US phone, email shape, DOB not in future, and graduation-year bounds.
5. Kiosk checks existing records for **the same first name, last name, and phone** (case-insensitive names). Exact duplicates are not appended; the success screen still appears.
6. Otherwise the kiosk appends a record with consent `Yes` or `No`, SMS/email statuses `New`, configured Source, and the staff-selected School; saves the CSV and resets the form.

The form intentionally does not display earlier records. Its date of birth is stored in the CSV, but the QR and SMS export omit it.

## Staff export filtering

The dashboard SMS list includes a row only if:

- `Text Consent` is exactly `Yes`;
- `Contact Status` is exactly `New`;
- First Name is present;
- The normalized phone has exactly ten digits;
- No other record contains the same normalized phone.

Output is **`FirstName|PhoneNumber`**, one person per newline. The QR encodes that same export, broken into batches (default 15). This is **plain text inside a QR**, not encryption; anyone with a scanner near the screen can read it. Changing status requires selecting rows, clicking `Mark contacted`, and **saving** changes. Copying/scanning alone does not change status.

## Reporting workbook

`Recruiting_Excel_Tracker.xlsx` is a separate workbook. It does **not** sync automatically; for manual reporting, paste data (minus CSV headers) into `LEADS!A5`. This design keeps the browser flow simple and avoids macros. Preserve the original workbook as an untouched backup if reporting formulas are changed.

## Privacy and production readiness

This package is **not a hardened application or an officially approved Air Force recruiting data system**. It has no user authentication, encryption at rest, independent audit log, centralized backup/retention enforcement, or concurrency locking. Editing the words or taking the word “prototype” off the screen does **not** confer government approval.

Before using real student information, especially minors' DOB, obtain authorization for collection, approved privacy/consent text and any parental-consent requirements, suitable devices and storage, approved records retention, controlled QR visibility, and approved transfer methods to the recruiter's iPhone. Do not forward the CSV or QR list through personal email. Use test data until that review is complete.


### v6 QR batch confirmation and removal

Batches snapshot submission IDs and normalized phone numbers as well as the line of QR text (`FirstName|PhoneNumber`). The staff dashboard confirms selected sent recipients, matches them by submission ID + number, changes their `Contact Status` to `Contacted`, and writes the CSV immediately. No automatic phone-to-PC notification or delivery receipt is implied. Unchecked recipients remain `New` and are included when QR batches are regenerated.

The **Delete selected** button removes selected rows permanently after a confirmation dialog and saves the CSV immediately. Both batch confirmation and deletion compare the on-disk CSV to the last loaded/saved snapshot; they refuse to write if the file has changed outside the manager.


## Email outreach
Email addresses are stored in the lead CSV and displayed only in the staff
manager. Column 11 `Email Status` is `New` or `Emailed` independently
of `Contact Status` (SMS). The last column, 12, is `School`. Prior 11- or
12-column files are supported and upgraded on their next save. CSV export includes first/last name, email and graduation
year; BCC copy is a semicolon-separated list. This site does not send email.

## School visit tags and bulk corrections

At each event the staff member provides a School name before connecting the kiosk to its CSV file. That value applies only to new submissions during the current kiosk session. The `Source` value is retained for the kind of outreach; it is not overwritten by School.

The manager shows School next to Graduation Year. Search matches school names, and selecting visible search matches enables a batch assignment. Staff can type a new school name and choose **Assign to selected** (replaces tags on selected rows only) or **Fill unassigned records** (sets blank School tags throughout the file). Both require confirmation and then **Save changes to CSV**. This changes only the school field, not SMS, email or consent status. Older 11-/12-column rows have blank School until assigned. Back up a CSV before any large correction.

The optional Excel workbook is a separate, non-synchronized reporting template. Its layout has not been extended to include School; use the full 13-column CSV for school-based analysis.
