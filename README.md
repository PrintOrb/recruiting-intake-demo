# Recruiting Intake System

**Independent software prototype for student-interest intake and recruiter follow-up.**

> **Unofficial project.** This is **not** an official U.S. Air Force or Department of Defense website, application, or approved information system. Air Force-inspired styling and credited public-domain military photography do **not** imply endorsement. **Do not enter real student information into the public demo.** Any use of the standalone edition with real records requires appropriate organizational, IT, privacy, and device authorization.

[Explore the fictional-data demo](https://printorb.github.io/recruiting-intake-demo/) · [Download the latest standalone release](https://github.com/PrintOrb/recruiting-intake-demo/releases/latest) · [Read release notes](RELEASE_NOTES.md)

## Overview

This local-first prototype offers a student registration kiosk and a separate recruiter dashboard.

| Feature | Details |
| --- | --- |
| Student intake | Contact details, date of birth, graduation year, and contact consent |
| Lead management | CSV-based review, duplicate-number review, deletion, and follow-up tracking |
| Age and birthdays | Individual age and birthdays coming up in the next 30 days |
| SMS preparation | QR batches containing `FirstName\|PhoneNumber`, with manual confirmation of recipients actually contacted |
| Email follow-up | BCC-ready addresses and a limited mail-merge CSV, with separate email status |
| iPhone Shortcut | Optional companion Shortcut installer linked to Apple iCloud |
| Photography | Three distinct, credited public-domain U.S. military photographs rotating every 20 seconds |

**The website does not send text messages or emails.** Scanning a QR batch never automatically marks a record as contacted.

## Try the fictional-data demo

The [GitHub Pages demo](https://printorb.github.io/recruiting-intake-demo/) lives under `docs/`. It uses fictional test records stored only in the visitor's browser, with no backend or shared database. It accepts designated fictional phone numbers and example email addresses. **Never enter real student data.**

- [Student kiosk demo](https://printorb.github.io/recruiting-intake-demo/Recruiting_Intake_Kiosk.html)
- [Recruiter dashboard demo](https://printorb.github.io/recruiting-intake-demo/Recruiting_Staff_Manager.html)

## Download the standalone edition

The [latest GitHub Release](https://github.com/PrintOrb/recruiting-intake-demo/releases/latest) contains a separate CSV-based application, **with a blank, header-only lead file and no demonstration records**.

1. Download the versioned `Recruiting_Intake_System_vX.Y.Z.zip` **release asset** (not GitHub's automatically generated source ZIP).
2. Extract the complete ZIP into a folder permitted by organizational policy.
3. Open `Recruiting_Intake_Kiosk.html` in a compatible desktop Edge or Chrome browser, then select the included blank `Recruiting_Leads.csv`.
4. Open `Recruiting_Staff_Manager.html` and select that **same** CSV.
5. Test with fictional contacts first. Read [standalone setup instructions](operational/START_HERE.txt) before any deployment.

The standalone application uses the browser's File System Access API, which may not be allowed on managed devices. **It has no login, backend or at-rest encryption.** Real data use requires authorization.

## Repository structure

```text
docs/                          Public fictional-data demo (GitHub Pages)
operational/                   Standalone source and staff instructions
operational/docs/              Technical guides and deployment checklist
.github/workflows/             Release automation
RELEASE_NOTES.md               Latest standalone release notes
```

Pages publishes `docs/` only. The `operational/` source is also visible in this public repository, even though it is not served as the website.

## Privacy, attribution, and limits

- Never commit actual lead CSVs, contact details, DOBs, exports, passwords or secrets. `.gitignore` is not a substitute for careful review.
- The public demo is for fictional data only; do not text demo numbers.
- Consent wording, collection of minors' data, retention and storage policies, use of personal devices, and QR/iPhone transfer require separate approval.
- The iPhone Shortcut is shared through iCloud and should be reviewed before installation. A publicly shared Shortcut is not an approved government workflow.
- The military photos are [credited here](docs/PHOTO_CREDITS.md). Their use does not imply Air Force/DoD endorsement.

## Maintenance and releases

[Customization guide](operational/docs/CUSTOMIZATION_GUIDE.md) · [Testing checklist](operational/docs/TESTING_CHECKLIST.md) · [Deployment and approval checklist](operational/docs/DEPLOYMENT_CHECKLIST.md)

The [GitHub Actions release workflow](.github/workflows/publish-release.yml) validates and packages **only** the standalone `operational/` application and rejects CSV records beyond the header row. Each release includes a versioned ZIP and SHA-256 checksum. Publishing a release does **not** constitute authorization to collect real student information.
