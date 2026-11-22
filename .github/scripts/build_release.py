#!/usr/bin/env python3
"""Create a self-contained, clean recruiting intake ZIP from operational/.

The public Pages demo is deliberately excluded. Only header-only CSV data is
allowed. Never publish a ZIP containing actual recruiting records.
"""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import zipfile

REPOSITORY = Path(__file__).resolve().parents[2]
SOURCE = REPOSITORY / "operational"
DIST = REPOSITORY / "dist"
ARCHIVE_ROOT = "Recruiting_Intake_System"
CSV_SOURCE = "Recruiting_Leads_EMPTY.csv"
CSV_OUTPUT = "Recruiting_Leads.csv"

EXPECTED_HEADERS = [
    "Submission ID", "Submitted At", "First Name", "Last Name", "Phone",
    "Email", "Date of Birth", "Graduation Year", "Text Consent",
    "Contact Status", "Source", "Email Status",
]

README = """# Recruiting Intake System — Standalone

**Independent prototype. Not an official U.S. Air Force or DoD application and not approved by default to collect real student data.**

This download includes the local-file student kiosk, recruiter dashboard and iPhone Shortcut installer, plus a **blank, header-only** `Recruiting_Leads.csv`. No real or demonstration lead records are included.

## Setup
1. Extract the entire ZIP to a permitted folder (not inside a ZIP viewer).
2. Open `Recruiting_Intake_Kiosk.html` in supported desktop Edge/Chrome, select the included blank `Recruiting_Leads.csv`, and test with fictional information.
3. Open `Recruiting_Staff_Manager.html` and select the **same** CSV to manage student records.
4. Use **Show QR for iPhone** for consented SMS batches. **Get iPhone Shortcut** opens `iphone-shortcut.html` with the shared iCloud link (internet required). Inspect the Shortcut before installation; confirm only contacts actually sent. Scanning does not automatically update CSV.
5. Use authorized email accounts for email outreach, and record only messages actually sent.
6. Ages and birthdays are calculated from DOB without extra CSV fields.

## Documentation
- `START_HERE.txt`, `docs/CUSTOMIZATION_GUIDE.md`, `docs/TECHNICAL_REFERENCE.md`
- `docs/TESTING_CHECKLIST.md`, `docs/DEPLOYMENT_CHECKLIST.md`
- `PHOTO_CREDITS.md` for three bundled public-domain U.S. military photos
- Optional blank `Recruiting_Excel_Tracker.xlsx` (not synced automatically)

## Security and privacy
There is no login, backend, or at-rest encryption. The app is an unapproved prototype: actual student records and any iPhone/QR transfers require authorization for the device, approved storage, notices, contact consent, and privacy/minors requirements. Never upload actual leads to GitHub or public Pages.
"""


def build(version: str) -> Path:
    if not version or not version.startswith("v") or not all(
        c.isalnum() or c in "._-" for c in version
    ):
        raise ValueError("version must be like v1.0.0")
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)
    for required in ["Recruiting_Intake_Kiosk.html", "Recruiting_Staff_Manager.html",
                     CSV_SOURCE,
                     "assets/js/Recruiting_Kiosk.js", "assets/js/Recruiting_Manager.js",
                     "assets/js/Offline_QR.js"]:
        if not (SOURCE / required).is_file():
            raise FileNotFoundError(required)
    raw_csv = (SOURCE / CSV_SOURCE).read_text(encoding="utf-8-sig")
    rows = [r.strip() for r in raw_csv.splitlines() if r.strip()]
    if len(rows) != 1 or rows[0].split(",") != EXPECTED_HEADERS:
        raise ValueError("Refusing release: blank lead CSV has unexpected content")
    # Optional workbook: refuse publication if filled with student rows.
    workbook = SOURCE / "Recruiting_Excel_Tracker.xlsx"
    if workbook.exists():
        with zipfile.ZipFile(workbook) as w:
            xml = w.read("xl/worksheets/sheet2.xml").decode("utf-8", errors="replace")
            import re
            if re.search(r'<c\s+[^>]*r="(?:[A-K])(?:[5-9]|[1-9][0-9]+)"[^>]*>\s*<(?:v|is)>', xml):
                raise ValueError("Refusing release: workbook LEADS sheet has saved rows")

    DIST.mkdir(exist_ok=True)
    archive = DIST / f"Recruiting_Intake_System_{version}.zip"
    exclusions = {"README.md", CSV_SOURCE}
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.writestr(f"{ARCHIVE_ROOT}/README.md", README)
        z.writestr(f"{ARCHIVE_ROOT}/{CSV_OUTPUT}", rows[0] + "\r\n")
        for path in sorted(SOURCE.rglob("*")):
            if not path.is_file():
                continue
            relative = path.relative_to(SOURCE)
            if path.name in exclusions or path.name.startswith("."):
                continue
            if "demo" in relative.as_posix().lower():
                raise ValueError(f"Refusing demo asset in release: {relative}")
            if relative.suffix.lower() == ".csv":
                raise ValueError(f"Unexpected CSV source: {relative}")
            z.write(path, f"{ARCHIVE_ROOT}/{relative.as_posix()}")
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    (DIST / f"Recruiting_Intake_System_{version}.sha256").write_text(
        f"{digest}  {archive.name}\n", encoding="utf-8")
    print(f"Created {archive} ({archive.stat().st_size:,} bytes)")
    print(f"SHA256 {digest}")
    return archive


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", default="v1.0.0")
    args = parser.parse_args()
    build(args.version)
