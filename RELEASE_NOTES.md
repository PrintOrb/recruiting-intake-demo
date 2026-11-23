# Recruiting Intake System v1.1.2

**Standalone interface cleanup and optional-contact-consent update.**

## What's changed

- Removed the on-screen independent-project notice from the standalone kiosk and staff manager and cleaned up both browser titles.
- Removed the independent/unofficial-project messaging and unused styling from the iPhone Shortcut installation page.
- Contact permission is **optional** on the student form: checked means `Text Consent = Yes`; unchecked means `Text Consent = No`, and the record is excluded from SMS QR batches and email exports.
- Updated the instructions to explain that declining contact still allows a submission.
- The public fictional-data demo continues to require a separate confirmation that all details are invented.

## Included in this ZIP

The standalone student kiosk, staff dashboard, iPhone Shortcut installation page, credited local background images, blank header-only lead CSV, optional blank Excel reporting workbook, and maintenance documentation. **No sample or actual lead records are included.**

The CSV schema, existing record compatibility, contact tracking, photo rotation, QR formats and mail-merge output remain unchanged.

## Setup

Download **`Recruiting_Intake_System_v1.1.2.zip`** from the Assets section, extract it completely, and open the kiosk in a supported desktop Edge/Chrome browser. Choose the included blank `Recruiting_Leads.csv`. Open the recruiter dashboard with that same file.

## Important use limitations

This is an independently developed prototype, **not an official or approved U.S. Air Force or DoD information system**. Public GitHub repository documentation retains that distinction. Using the software with real student records requires organizational, IT, privacy, consent, data storage, retention, and mobile-device/QR transfer approval. No login or at-rest encryption is provided; the public demo is for fictional records only.
