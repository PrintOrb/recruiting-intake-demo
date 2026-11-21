# Recruiting Intake — Demo + Operational builds

Two **separate** versions of the same Air Force-inspired recruiting interface. This is an unofficial software project and is not an approved government information system.

## 1) `docs/` — Public GitHub Pages DEMO
- Uses fictional test leads in the visitor's browser (localStorage), no CSV file picker or backend.
- Public demo restricts submissions to example.com email addresses and fictional numbers in the 202-555-01XX range.
- Includes student kiosk, staff dashboard, QR batches, and confirmation / contact tracking simulations.
- Do not enter real student information or send texts to demo numbers.
- The student and staff demo pages share the same browser's local demo records. Different devices won't share records.

## 2) `operational/` — Non-demo local-file build
- Includes the original v7 kiosk/dashboard using the browser's File System Access API to read/write an approved CSV file.
- No real student records and no demo dataset are committed to this repository.
- This source is deliberately **outside** the published GitHub Pages directory.
- It is not ready to use with real student information until deployment, endpoint/browser permissions, privacy notice, consent, record retention and device/SMS transfer have been approved by the appropriate Air Force personnel.
- Read `operational/README.md` before any deployment.

## Publishing the demo with GitHub Pages
1. Upload this repository's contents to the `main` branch.
2. Open Settings → Pages → Build and deployment → Source: **Deploy from a branch**.
3. Choose `main`, folder **`/docs`**, then Save.
4. Public demonstration homepage: `https://printorb.github.io/recruiting-intake-demo/`.

Only `/docs` is published in Pages with the recommended configuration. The non-demo source code may still be viewed in the public repository; do not place student data, keys or passwords anywhere in this repo.

## Updating
- Common editable text and colors: `assets/js/Recruiting_Config.js` inside the relevant build.
- CSS and HTML are organized under each build folder.
- SMS format remains `FirstName|PhoneNumber` (one per line); do not reverse it.
- Run the smoke tests after changes; do not modify `Offline_QR.js` without reviewing license and compatibility.

## File storage
Never check in the real `Recruiting_Leads.csv`, exports, backups or personalized text message lists. The `.gitignore` excludes these files. `.gitignore` is not a substitute for checking uploads manually.

## Download a standalone version via GitHub Releases

Open [Releases](https://github.com/PrintOrb/recruiting-intake-demo/releases/latest) and download the versioned `Recruiting_Intake_System_vX.Y.Z.zip` **asset**, not GitHub's auto-generated source ZIP. It contains only the non-demo kiosk, dashboard, assets, a blank header-only `Recruiting_Leads.csv`, and the optional empty Excel reporting workbook.

The first release is built automatically by `.github/workflows/publish-release.yml`. For later versions, run **Actions → Publish standalone recruiting system → Run workflow** with a new version like `v1.0.1`. Never include real leads in a release.


### Email follow-up (v1.0.0)

The staff dashboard includes an email-outreach panel. Copy unique opted-in
addresses for BCC, or download a mail-merge CSV containing FirstName, LastName,
Email and GraduationYear, without dates of birth. Use only an approved recruiting
mail account/service; nothing is sent automatically. Following a successful
send, select those leads and click **Mark emailed** then **Save changes to CSV**.
Email Status is distinct from the existing SMS Contact Status. The kiosk and
manager can open older eleven-column CSVs and upgrade them on the next save.

### Timed student background slideshow

The student page automatically cycles through three Air Force-inspired photo treatments every 20 seconds, with a 1.8-second crossfade. Configure the slideshow in each build's `assets/js/Recruiting_Config.js`; the form and CSV workflows are unchanged.
