<div align="center">

# Recruiting Intake System

**A local-first student intake and recruiter follow-up prototype.**

[![Standalone release](https://img.shields.io/github/v/release/PrintOrb/recruiting-intake-demo?label=latest%20release)](https://github.com/PrintOrb/recruiting-intake-demo/releases/latest)
[![Release build](https://github.com/PrintOrb/recruiting-intake-demo/actions/workflows/publish-release.yml/badge.svg)](https://github.com/PrintOrb/recruiting-intake-demo/actions/workflows/publish-release.yml)
![Project status](https://img.shields.io/badge/status-independent%20prototype-4b6383)

**[Live demo](https://printorb.github.io/recruiting-intake-demo/)** · **[Download](https://github.com/PrintOrb/recruiting-intake-demo/releases/latest)** · **[Documentation](operational/README.md)**

</div>

## At a glance

Recruiting Intake System is a browser-based prototype that replaces handwritten or spreadsheet-based interest signups with a student-facing registration screen and a separate staff dashboard.

| Student kiosk | Recruiter dashboard |
|:--|:--|
| Contact information and explicit consent | Lead search, duplicate-number review, status management |
| Date of birth and graduation year | Calculated age and upcoming birthdays |
| Rotating, credited military photography | QR batches for a companion iPhone Shortcut |
| Browser-based workflow | Email BCC list and limited mail-merge CSV |

**The web app does not send texts or emails.** Sending takes place using external tools, and staff must confirm successful outreach manually.

## Try it

| | **Public demo** | **Standalone edition** |
|---|---|---|
| **Start** | [Launch GitHub Pages demo](https://printorb.github.io/recruiting-intake-demo/) | [Download latest release](https://github.com/PrintOrb/recruiting-intake-demo/releases/latest) |
| **Purpose** | Preview with fictional student data | Local CSV-based intake and follow-up |
| **Storage** | Browser-local fictional records | Staff-selected local CSV file |
| **Included records** | Fictional examples | Blank, header-only CSV |
| **Data restrictions** | **Never enter real student data** | Requires organizational approval before real use |

**Explore the demo:** [Student intake](https://printorb.github.io/recruiting-intake-demo/Recruiting_Intake_Kiosk.html) · [Recruiter dashboard](https://printorb.github.io/recruiting-intake-demo/Recruiting_Staff_Manager.html) · [iPhone Shortcut installation page](https://printorb.github.io/recruiting-intake-demo/iphone-shortcut.html)

### Standalone quick start

1. Download the **versioned ZIP under Releases → Assets**, not the auto-generated source archive.
2. Extract the complete archive to a permitted folder.
3. Open `Recruiting_Intake_Kiosk.html` in compatible desktop Microsoft Edge or Chrome and select the included **blank** `Recruiting_Leads.csv`.
4. Open `Recruiting_Staff_Manager.html` and select that **same** CSV file.
5. Test with fictional records. Follow [START_HERE](operational/START_HERE.txt) and the [deployment checklist](operational/docs/DEPLOYMENT_CHECKLIST.md) before any operational use.

## How it works

```text
Student kiosk
    │
    ▼
Staff-selected CSV file (standalone) ──► Recruiter dashboard
                                               │
                           ┌───────────────────┴──────────────────┐
                           ▼                                      ▼
                   SMS/QR batch export                     Email export
                           │                                      │
                           ▼                                      ▼
                   iPhone Shortcut                       Approved mail tool
                           │                                      │
                           └─────────► Staff confirms sends ◄────┘
```

The public demo substitutes browser-local fictional data for the CSV. Neither edition maintains a server-side student database.

## Technology

**HTML · CSS · Vanilla JavaScript · Browser File System Access API · GitHub Pages · GitHub Actions**

No framework, backend, account system, or server database. GitHub Actions validates and packages the standalone release; the public demo is deployed from `docs/`.

## Repository structure

```text
.
├── docs/                        GitHub Pages fictional-data demo
├── operational/                 Standalone kiosk, dashboard, and assets
│   └── docs/                    Customization, testing, deployment guidance
├── .github/                     Release automation
└── RELEASE_NOTES.md             Latest standalone release notes
```

**Documentation:** [Standalone setup](operational/README.md) · [Customization](operational/docs/CUSTOMIZATION_GUIDE.md) · [Testing](operational/docs/TESTING_CHECKLIST.md) · [Deployment review](operational/docs/DEPLOYMENT_CHECKLIST.md) · [Photo credits](docs/PHOTO_CREDITS.md) · [Release notes](RELEASE_NOTES.md)

## Privacy, security, and attribution

This is a demonstration/prototype, **not an approved government information system**. The standalone application has no login, backend access controls, or at-rest encryption. Contact details and DOB can be sensitive, particularly for minors.

- Do not submit real people’s information to the public demo or commit actual lead CSVs, contact lists, credentials, or exports to this repository.
- Validate contact consent, privacy notices, storage, retention, browser/device policies, and any phone/QR transfer through the appropriate organization before using real records.
- The iPhone Shortcut is shared separately through Apple iCloud. Anyone installing it should review the actions; an install link does not imply official approval.
- The credited public-domain military photographs do **not** imply Air Force or DoD endorsement. See [sources and photographers](docs/PHOTO_CREDITS.md).

**Maintainer note:** The release ZIP is assembled from `operational/` only. The build checks that the bundled CSV contains headers and no student records.
