# Customization guide

Designed for someone coming back to this project months later. Edit with **VS Code**, Notepad++, or another plain-text editor. These are HTML/CSS/JavaScript files; there is no build, install, database service, or internet dependency. Make a backup of the entire folder before editing.

## 1. Fastest way: edit the settings file

Open **`assets/js/Recruiting_Config.js`**. The object called `settings` is organized into easy-to-find sections:

- `brand` — top navigation/header labels and badges on both pages.
- `kiosk` — hero slogan, description, registration heading, thank-you copy, **contact consent text**.
- `staff` — recruiter dashboard heading.
- `data` — expected CSV filename in error messages, source label, graduation-year limits, success-message duration.
- `sms` — QR size, and the existing Shortcut delimiter `|`.
- `colors` — common brand color values in hex (for example, `#2174d8`).

**Example: update a school-event slogan**

```js
kiosk: {
  heroMain: "Find your",
  heroAccent: "next mission.",
  // other settings remain unchanged
}
```

**Example: change blue to another color**

```js
colors: {
  primary: "#2762a0",
  primaryHover: "#1b497b",
  navy: "#071a31"
}
```

**Example: smaller QR batches for easier scanning**

```js
sms: {
  separator: "|",    // DO NOT CHANGE unless you update the Shortcut
  qrBatchSize: 10
}
```

Save the file, then refresh the pages. **All files must stay in the same relative folder structure.**

## 2. Change labels, placeholders, or layout

For the student interface, open **`Recruiting_Intake_Kiosk.html`**. Look for the comment `FORM FIELDS`. Text inside `<label>...</label>` is the visible label. Text in the `placeholder="..."` attribute is an example displayed in an empty input.

Example:

```html
<label for="phone">Best contact number *</label>
<input id="phone" type="tel" name="phone" placeholder="(812) 555-0123" ...>
```

The `id="phone"` is how JavaScript finds that field, so **keep IDs unchanged** if you only want different wording. Likewise, keep `id="interestForm"`, `id="submitBtn"`, `id="connect"`, etc. The manager HTML has an `SMS EXPORT` comment near the SMS panel.

Some labels and titles are controlled via `data-config="..."` markers. Change those strings in **`Recruiting_Config.js`**, **not** between the empty HTML tags (the config overwrites their text).

## 3. Change visual styling

- `assets/css/Recruiting_Kiosk.css` — student form, header, buttons, input fields.
- `assets/css/Recruiting_Manager.css` — statistics, lead table, QR dialog.
- For the main color palette, edit `settings.colors` in the config file instead of replacing individual CSS values.

Both CSS files are expanded and organized by selector, so edits are readable. The page has a responsive mobile layout, but **CSV writing still requires supported desktop browsers**.

## 4. What NOT to casually change

| Item | Why it matters |
|---|---|
| CSV header names and order | Kiosk and staff manager both assume the same exact columns. |
| `FirstName|PhoneNumber` | The existing iPhone Shortcut splits on `|` and expects **name first**. |
| `New` / `Contacted` / `Yes` values | The export filter uses those exact strings. |
| `<input id="...">` field IDs | Validation and record saving reference these IDs. |
| `Offline_QR.js` | Third-party QR encoder; update deliberately and retain its license. |
| Consent wording or DOB handling | Must be approved for the actual audience and organizational rules. |

## 5. How to add a brand-new form field

A field like "school name" is **not** merely a visual edit. You must coordinate four parts:

1. Add the label/input to `Recruiting_Intake_Kiosk.html` (with a unique ID).
2. Read/validate its value and append it in `assets/js/Recruiting_Kiosk.js`.
3. Add the column **in the same location** in `KIOSK_HEADERS`, `MANAGER_HEADERS` in `Recruiting_Manager.js`, and the CSV file; migrate existing rows to avoid changing the meaning of later columns.
4. Update any manager display, CSV mappings, and the Excel tracker if it needs the new field.

**Do not simply insert a column in the middle of an existing CSV.** Existing index mappings such as `[2]` for First Name and `[4]` for Phone would then become wrong. For data schema changes, work with fictional data and follow the testing checklist.

## 6. Recommended editing workflow

1. Copy the package folder and rename the copy with a version/date.
2. Edit **only the needed file**.
3. Open both pages locally and refresh; use fictional contact details.
4. Run `docs/TESTING_CHECKLIST.md`, including an iPhone QR scan.
5. Copy the new folder to the staff computer only after review and authorization.

**Need to change the contact message?** That message lives in the iPhone Shortcut; the system only supplies `FirstName|PhoneNumber` lines. Do not embed the recruiter's message in the QR unless you intentionally redesign the workflow.


## 7. The Air Force-inspired theme (v5)

- The student kiosk and staff manager are styled as one interface system: dark navy, white and cool blue highlights, angular borders, condensed uppercase headings.
- The header mark reading **AF** is a custom typographic element, not an official Air Force symbol. Do not replace it with official insignia without appropriate review of applicable branding guidance.
- Brand wording, accent colors and headings are in `assets/js/Recruiting_Config.js`.
- For different event photo backgrounds replace `assets/images/Kiosk_Background.jpg` with a new image (same filename), or change `--kiosk-bg-image` in `assets/css/Recruiting_Kiosk.css`.
- The browser uses locally installed system fonts, so it still works offline. If a condensed font isn't installed, the browser uses a fallback.
- Test readability after every background swap and run `docs/TESTING_CHECKLIST.md` before using the form.
