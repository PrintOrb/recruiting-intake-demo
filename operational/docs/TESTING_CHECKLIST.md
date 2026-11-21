# Testing checklist after changes

Work with **fictional contacts or numbers you control**. Use a fresh copy of the included header-only `Recruiting_Leads.csv`. Do not test text transmission to real leads.

## Appearance and editing

- [ ] Open `Recruiting_Intake_Kiosk.html` in Edge/Chrome: header, slogan, fields and consent text all appear.
- [ ] Open `Recruiting_Staff_Manager.html`: the heading, stats and file selector appear.
- [ ] Change one visible line in `assets/js/Recruiting_Config.js`; refresh and verify it changes only the intended display.
- [ ] Confirm both pages work with internet disconnected (all assets are included locally).

## Kiosk and records

- [ ] Connect the provided blank CSV and submit a fictional student.
- [ ] Confirm the success page appears and the form clears for the next person.
- [ ] Open the CSV in Excel (only **after** exiting kiosk intake) and check values in the correct columns.
- [ ] Submit an exact duplicate fictional student; confirm the record is not added twice.
- [ ] Try an invalid phone, future DOB, malformed email, and out-of-range graduation year. They should not be saved.
- [ ] Confirm consent must be checked to submit.

## Staff and export

- [ ] Close kiosk, open staff manager, and load the **same** CSV.
- [ ] Confirm the fictional person appears with `New` and `Yes`.
- [ ] Verify the export line is `FirstName|10DigitPhone` (name **first**).
- [ ] Use **Show QR for iPhone**, scan with a test Shortcut/device, and verify the decoded text matches the export.
- [ ] Add enough fictional leads to create two QR batches; use **Next batch** and **Previous batch**.
- [ ] Mark a fictional person `Contacted`, click **Save status changes**, and reload. Confirm they are excluded from text/QR exports.
- [ ] Add two fictional people with the same phone; confirm **neither** appears in the SMS export (shared-number review).
- [ ] Verify both pages remain usable after browser reload and reselecting the CSV.

## Before any authorized event

- [ ] Confirm permission to use these devices, storage and data-transfer methods.
- [ ] Verify the privacy notice, contact consent wording, and any parental requirements.
- [ ] Restrict computer and QR visibility to appropriate staff.
- [ ] Back up the approved lead file to an authorized location; avoid personal email.
- [ ] Make sure Excel is not editing the CSV while student intake is active.
- [ ] Run a final iPhone test with a number controlled by staff.


## v6 confirmation and deletion tests

- [ ] Scan a fictional test QR, review the SMS sends, then in the QR panel uncheck one recipient and confirm. Verify only the checked recipients become `Contacted` in the actual CSV, and unchecked recipients remain `New`.
- [ ] Reopen the QR dialog: confirmed recipients should no longer be exported.
- [ ] Confirm no lead status changes merely by displaying or scanning a QR.
- [ ] Select a fictional lead, choose **Delete selected**, cancel; confirm no data is lost.
- [ ] Choose **Delete selected** again, confirm; reload the file and verify only the chosen lead is gone.
- [ ] With a lead CSV open in staff manager, modify it using an external process and then attempt a status write; confirm the dashboard refuses to overwrite the newer file.
