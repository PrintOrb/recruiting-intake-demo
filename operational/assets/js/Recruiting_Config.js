/*
 * RECRUITING INTAKE — EDITABLE SETTINGS
 * ------------------------------------
 * Change ordinary text, colors, file labels and QR batch size HERE.
 * You should not need to edit the HTML or other JavaScript for those changes.
 * See docs/CUSTOMIZATION_GUIDE.md before adding, renaming or removing fields.
 *
 * This is a plain browser script: no framework, build tools or internet access.
 */
(function () {
  "use strict";

  const settings = {
    brand: {
      name: "U.S. AIR FORCE",
      studentSubtitle: "RECRUITING • STUDENT INTEREST",
      studentBadge: "AIM HIGH",
      staffSubtitle: "RECRUITING OPERATIONS",
      staffBadge: "LEAD MANAGEMENT"
    },

    kiosk: {
      heroEyebrow: "YOUR FUTURE IS WAITING",
      heroMain: "AIM",
      heroAccent: "HIGH.",
      heroDescription: "A world of opportunity starts with one conversation. Explore careers, education, travel, and what your future in the Air Force could look like.",
      formTitle: "Start your journey.",
      formDescription: "One minute. One first step. Enter your information to hear from a recruiter.",
      successTitle: "Mission received.",
      successDescription: "Your information has been received. Thanks for taking the first step.",
      backgroundShuffle: {
        enabled: true,
        mode: "timed",
        intervalSeconds: 20,
        fadeSeconds: 1.8,
        // Replace entries with additional local images to customize the rotation.
        images: [
          "assets/images/Kiosk_Background.jpg",
          "assets/images/Kiosk_Background.jpg",
          "assets/images/Kiosk_Background.jpg"
        ],
        // Three appearances using the included photo. No extra downloads.
        presets: [
          { position: "center center", scale: 1, filter: "none" },
          { position: "35% center", scale: 1.12, filter: "saturate(1.22) contrast(1.08)" },
          { position: "68% center", scale: 1.16, filter: "saturate(.72) contrast(1.13) brightness(.91)" }
        ]
      },


      // IMPORTANT: Obtain approval for this contact language and the associated
      // privacy notice, including any rules for students under 18.
      consentText: "I agree to be contacted by an Air Force recruiter using the phone number or email I provided. *"
    },

    staff: {
      heading: "Recruiting Lead Command"
    },

    data: {
      // Do not change the CSV column names/order without updating both programs.
      expectedFileName: "Recruiting_Leads.csv",
      sourceLabel: "School outreach",
      minGraduationYear: 2000,
      maxGraduationYear: 2050,
      successScreenMilliseconds: 6000
    },

    sms: {
      // Existing iPhone Shortcut expects FirstName|PhoneNumber on each line.
      // Changing this separator breaks the Shortcut until it is updated too.
      separator: "|",
      qrBatchSize: 15
    },

    colors: {
      primary: "#1765bb",
      primaryHover: "#104d96",
      navy: "#081c35"
    }
  };

  window.RECRUITING_CONFIG = settings;

  // Populate [data-config] elements as plain text (not HTML) to prevent markup
  // in settings from being interpreted as executable content.
  window.applyRecruitingConfig = function () {
    document.querySelectorAll("[data-config]").forEach(function (element) {
      const value = element.dataset.config.split(".").reduce(function (object, key) {
        return object && object[key];
      }, settings);
      if (typeof value === "string" || typeof value === "number") {
        element.textContent = String(value);
      }
    });

    document.documentElement.style.setProperty("--brand-primary", settings.colors.primary);
    document.documentElement.style.setProperty("--brand-primary-hover", settings.colors.primaryHover);
    document.documentElement.style.setProperty("--navy", settings.colors.navy);
  };
})();
