# Recruiting Intake System v1.2.1

**School visit tagging, batch school assignment, and updated documentation.**

## Highlights

- **School selected once:** Staff enter a school or event name before connecting the kiosk CSV. All new student submissions during that kiosk session automatically receive the same School tag.
- **School column:** The staff manager displays School beside the existing graduation-year column. Staff can search for a school to find or select visit records.
- **Bulk edits:** **Assign to selected** replaces the school on chosen rows; **Fill unassigned records** only tags rows with no school. Both require confirmation and Save changes to CSV.
- **Legacy data preserved:** Old 11- and 12-column lead files open and are migrated safely to the 13-column format with an appended School field. Existing consent, SMS, and email statuses keep their original column positions.
- **Updated documentation and tests:** Technical reference, customization notes, and checklists now cover staff school setup, CSV migration, and bulk school tagging.

No changes to SMS QR content (`FirstName|PhoneNumber`), Shortcut install links, email mail-merge fields, consent rules, birthdays, or kiosk backgrounds.

## Download and setup

Use **`Recruiting_Intake_System_v1.2.1.zip`** from the release assets. Extract the complete ZIP and open `Recruiting_Intake_Kiosk.html` in desktop Edge/Chrome. On the staff setup screen, type the school/event name, then open the included blank `Recruiting_Leads.csv`. Run fictional test submissions before operational use. Open the staff manager with the same CSV to inspect school names and perform bulk corrections.

The release includes a blank, header-only leads CSV, an optional blank Excel reporting workbook, locally bundled military photographs, the iPhone Shortcut installer, and current documentation. The Excel reporting workbook is not synchronized automatically and does not yet include a separate School reporting column. **No public demo data or actual student records are included.**

## Important use limitations

Independent prototype, not an official or approved U.S. Air Force/DoD information system. Obtain the required organizational, privacy, storage, consent, IT and mobile-device/QR approvals before using any real student information; local CSV files are not encrypted.
