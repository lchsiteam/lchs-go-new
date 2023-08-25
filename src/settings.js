// Settings menu data

/**
 * The grade level setting
 * @typedef {Object} SettingsItem
 * @property {string} mode - The mode of the setting
 * @property {string} default - The default value of the setting
 * @property {boolean} new - Whether the setting is new
 * @property {boolean} experimental - Whether the setting is experimental
 * @property {boolean} reload - Whether the setting requires a reload
 */

/**
 * The settings menu data
 * @typedef {Object} Settings
 * @property {SettingsItem} GRADE_LEVEL - The grade level setting
 * @property {SettingsItem} EXTRA_PERIODS - The extra periods setting
 * @property {SettingsItem} SIXTH_PERIOD - The sixth period setting
 * @property {SettingsItem} ZERO_PERIOD - The zero period setting
 * @property {SettingsItem} TWENTY_FOUR_HOUR - The 24 hour setting
 * @property {SettingsItem} AM_PM - The AM/PM setting
 * @property {SettingsItem} INLINE_DETAILS - The inline details setting
 * @property {SettingsItem} COLOR_THEME - The color theme setting
 * @property {SettingsItem} THEME_ANIMATION - The theme animation setting
 * @property {SettingsItem} THEME_ANIMATION_INTENSITY - The theme animation intensity setting
 * @property {SettingsItem} LANGUAGE - The language setting
 * @property {SettingsItem} NOTIFICATIONS_TOGGLE - The notifications toggle setting
 * @property {SettingsItem} NOTIFICATIONS_START - The notifications start setting
 * @property {SettingsItem} NOTIFICATIONS_END - The notifications end setting
 */

/**
 * The settings menu data
 * @type {Settings}
 */
export const settings = {
  GRADE_LEVEL: {
    mode: "dropdown",
    options: ["GRADE_7", "GRADE_8", "GRADE_9", "GRADE_10", "GRADE_11", "GRADE_12"],
    default: "GRADE_9",
    new: false,
    experimental: false,
    reload: true,
  },
  EXTRA_PERIODS: {
    mode: "toggle",
    options: [
      [true, "ON"],
      [false, "OFF"],
    ],
    default: false,
    new: false,
    experimental: true,
    reload: true,
  },
  SIXTH_PERIOD: {
    mode: "toggle",
    options: [
      [true, "ON"],
      [false, "OFF"],
    ],
    default: true,
    new: false,
    experimental: false,
    reload: false,
  },
  ZERO_PERIOD: {
    mode: "toggle",
    options: [
      [true, "ON"],
      [false, "OFF"],
    ],
    default: true,
    new: false,
    experimental: false,
    reload: false,
  },
  TWENTY_FOUR_HOUR: {
    mode: "toggle",
    options: [
      [true, "ON"],
      [false, "OFF"],
    ],
    default: false,
    new: false,
    experimental: false,
    reload: false,
  },
  AM_PM: {
    mode: "toggle",
    options: [
      [true, "ON"],
      [false, "OFF"],
    ],
    default: false,
    new: false,
    experimental: false,
    reload: false,
  },
  INLINE_DETAILS: {
    mode: "toggle",
    options: [
      [true, "ON"],
      [false, "OFF"],
    ],
    default: true,
    new: false,
    experimental: false,
    reload: false,
  },
  COLOR_THEME: {
    mode: "color-slider",
    max: 360,
    min: 0,
    default: 3,
    new: false,
    experimental: false,
    reload: false,
  },
  THEME_ANIMATION: {
    mode: "toggle",
    options: [
      [true, "ON"],
      [false, "OFF"],
    ],
    default: false,
    new: false,
    experimental: false,
    reload: false,
  },
  THEME_ANIMATION_INTENSITY: {
    mode: "color-slider",
    max: 180,
    min: 10,
    default: 15,
    new: false,
    experimental: false,
    reload: false,
  },
  LANGUAGE: {
    mode: "dropdown",
    options: ["ENGLISH", "SPANISH", "GERMAN", "FRENCH", "ITALIAN", "LOLCAT", "DEVELOPER"],
    default: "ENGLISH",
    new: true,
    experimental: true,
    reload: true,
  },
  NOTIFICATIONS_TOGGLE: {
    mode: "toggle",
    options: [
      [true, "ON"],
      [false, "OFF"],
    ],
    default: false,
    new: false,
    experimental: true,
    reload: false,
  },
  NOTIFICATIONS_START: {
    mode: "dropdown",
    options: ["0_MIN", "1_MIN", "2_MIN", "3_MIN", "4_MIN", "5_MIN", "6_MIN", "7_MIN", "8_MIN", "9_MIN", "10_MIN", "OFF"],
    default: "3_MIN",
    new: false,
    experimental: true,
    reload: false,
  },
  NOTIFICATIONS_END: {
    mode: "dropdown",
    options: ["0_MIN", "1_MIN", "2_MIN", "3_MIN", "4_MIN", "5_MIN", "6_MIN", "7_MIN", "8_MIN", "9_MIN", "10_MIN", "OFF"],
    default: "2_MIN",
    new: false,
    experimental: true,
    reload: false,
  },
};

// Export the current settings JSON
export let userSettings = JSON.parse(localStorage.getItem("settings"));
if (userSettings == null) {
  userSettings = Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, value.default]));
  console.log(userSettings);

  // Send a message for the extension to pick up on when the settings change
  window.postMessage({ settingsChanged: true });
  localStorage.setItem("settings", JSON.stringify(userSettings));
}
