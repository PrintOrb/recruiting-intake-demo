# Public GitHub Pages demo — test checklist

**Fictional data only.** The public demo stores test records in browser storage, not a CSV file. Never enter real student data or send messages to demonstration numbers.

## Public appearance
- [ ] Home page, kiosk, staff dashboard and Shortcut installer clearly state that the project is independent/unofficial.
- [ ] No stray apostrophes or quotation marks in the two demo banners.
- [ ] Three different credited military photos cycle at 20-second intervals with a smooth fade.
- [ ] Shortcut installer opens the expected iCloud share link. The install QR contains only the URL, no lead data.

## Student intake and staff dashboard
- [ ] Open the student kiosk and demo records.
- [ ] Use a fictional name, number in the `202-555-01XX` range, test email such as `name@example.com`, plausible DOB, graduation year, and consent.
- [ ] Reject numbers outside the fictional range and non-demo email addresses.
- [ ] Confirm submission appears in the staff demo running in the same browser, with age and birthday.
- [ ] Verify upcoming birthday calculations and SMS/email status tracking.
- [ ] Generate a `FirstName|PhoneNumber` QR but do not send to demo numbers.
- [ ] Confirm scanning/displaying a QR alone does not change statuses.
- [ ] Verify the BCC/email CSV excludes DOB and is limited to unique consented addresses.
- [ ] Delete a fictional record, then use **Reset demo records**.

## Safety
- [ ] No real lead CSV, student contact details, or credentials appear in the repository or demo.
- [ ] For the CSV-based edition use the separate `operational/docs/TESTING_CHECKLIST.md`.

## Optional outreach consent

- [ ] With the separate **fictional-data confirmation** checked, submit a fictional lead without outreach consent. The record should save as `No` and never appear in eligible SMS or email exports.
- [ ] Submit a distinct fictional lead with outreach consent checked. It should save as `Yes` and be eligible only when all other outreach checks pass.
- [ ] Leave the required **fictional-data confirmation** unchecked and verify that the public demo will not submit.

## School tagging (fictional demo)

- [ ] The demo kiosk requires a fictional school name in staff setup before student submissions.
- [ ] New fictional students have that School value; older 11-/12-column demo records still load.
- [ ] The manager School column and search work, and batch school assignments save within the same browser's fictional demo storage.
- [ ] Bulk school changes do not alter consent or SMS/email status. Reset demo records to restore the fictitious starter school names.
