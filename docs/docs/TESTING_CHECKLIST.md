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
