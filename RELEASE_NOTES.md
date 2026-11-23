# Recruiting Intake System v1.2.0

**New: School visit tagging and bulk assignment.**

## What changed

- **Set school once per visit.** Staff enter the school or recruiting event name before connecting the kiosk to its lead CSV. Every subsequent student submission is automatically tagged; students do not enter their school.
- **School column and search.** Recruiters can see each lead's school and search/filter the table by school.
- **Bulk assignment.** Enter a school in the staff dashboard to update selected rows or fill all unassigned records without overwriting existing school names. Confirmation is required; click Save changes to CSV to persist assignments.
- **Compatible with older records.** Earlier 11- and 12-column CSVs are accepted. They migrate to 13 columns when saved, with an empty School field on historical records until assigned.
- Demo starter records use a fictional school name.

**Unchanged:** contact-consent rules, SMS QR format (`FirstName|PhoneNumber`), email exports and status tracking, birthdays, and the timed photo slideshow.

## Standalone download

Download **`Recruiting_Intake_System_v1.2.0.zip`** under Assets. Extract it completely and open the kiosk in supported desktop Edge/Chrome. Enter the school name and select the included blank `Recruiting_Leads.csv`; students then use the form as normal. Later, open the manager with the same CSV to review, search, or bulk-assign school tags.

The standalone ZIP contains a header-only lead CSV, an optional blank Excel reporting workbook, locally bundled credited military photos, the iPhone Shortcut installer, and documentation. It includes **no demo records or real student information**.

## Use limitations

This is an independently developed prototype, not an official or approved U.S. Air Force or DoD information system. Obtain applicable IT, privacy, consent, storage, and mobile-device/QR transfer authorization before collecting real student information, especially minors' data. The local CSV is unencrypted.
