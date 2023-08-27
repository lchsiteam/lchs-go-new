// Settings menu data
// Feel free to remove these types if they prove, not useful
// I was mostly just experimenting with jsdoc
/**
 * @typedef {Object} Dropdown
 * @property {"dropdown"} mode - The mode of the setting
 * @property {string[]} options - The options of the setting
 * @property {string} default - The default value of the setting
 * @property {boolean} new - Whether the setting is new
 * @property {boolean} experimental - Whether the setting is experimental
 * @property {boolean} reload - Whether the setting requires a reload
 */
/**
 * @typedef {Object} Toggle
 * @property {"toggle"} mode - The mode of the setting
 * @property {{value: number | boolean, text: string}[]} options - The options of the setting
 * @property {boolean} default - The default value of the setting
 * @property {boolean} new - Whether the setting is new
 * @property {boolean} experimental - Whether the setting is experimental
 * @property {boolean} reload - Whether the setting requires a reload
 */
/**
 * @typedef {Object} Slider
 * @extends SettingsItem
 * @property {"slider"} mode - The mode of the setting
 * @property {number} max - The max value of the setting
 * @property {number} min - The min value of the setting
 * @property {number} default - The default value of the setting
 * @property {boolean} new - Whether the setting is new
 * @property {boolean} experimental - Whether the setting is experimental
 * @property {boolean} reload - Whether the setting requires a reload
 */

/**
 * The settings menu data
 * @typedef {Object} Settings
 * @property {Dropdown} GRADE_LEVEL - The grade level setting
 * @property {Toggle} EXTRA_PERIODS - The extra periods setting
 * @property {Toggle} SIXTH_PERIOD - The sixth period setting
 * @property {Toggle} ZERO_PERIOD - The zero period setting
 * @property {Toggle} TWENTY_FOUR_HOUR - The 24 hour setting
 * @property {Toggle} AM_PM - The AM/PM setting
 * @property {Toggle} INLINE_DETAILS - The inline details setting
 * @property {Slider} COLOR_THEME - The color theme setting
 * @property {Toggle} THEME_ANIMATION - The theme animation setting
 * @property {Slider} THEME_ANIMATION_INTENSITY - The theme animation intensity setting
 * @property {Dropdown} LANGUAGE - The language setting
 * @property {Toggle} NOTIFICATIONS_TOGGLE - The notifications toggle setting
 * @property {Dropdown} NOTIFICATIONS_START - The notifications start setting
 * @property {Dropdown} NOTIFICATIONS_END - The notifications end setting
 */

/** @type {Settings} */
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
      { value: true, text: "ON" },
      { value: false, text: "OFF" },
    ],
    default: false,
    new: false,
    experimental: true,
    reload: true,
  },
  SIXTH_PERIOD: {
    mode: "toggle",
    options: [
      { value: true, text: "ON" },
      { value: false, text: "OFF" },
    ],
    default: true,
    new: false,
    experimental: false,
    reload: false,
  },
  ZERO_PERIOD: {
    mode: "toggle",
    options: [
      { value: true, text: "ON" },
      { value: false, text: "OFF" },
    ],
    default: true,
    new: false,
    experimental: false,
    reload: false,
  },
  TWENTY_FOUR_HOUR: {
    mode: "toggle",
    options: [
      { value: true, text: "ON" },
      { value: false, text: "OFF" },
    ],
    default: false,
    new: false,
    experimental: false,
    reload: false,
  },
  AM_PM: {
    mode: "toggle",
    options: [
      { value: true, text: "ON" },
      { value: false, text: "OFF" },
    ],
    default: false,
    new: false,
    experimental: false,
    reload: false,
  },
  INLINE_DETAILS: {
    mode: "toggle",
    options: [
      { value: true, text: "ON" },
      { value: false, text: "OFF" },
    ],
    default: true,
    new: false,
    experimental: false,
    reload: false,
  },
  COLOR_THEME: {
    mode: "slider",
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
      { value: true, text: "ON" },
      { value: false, text: "OFF" },
    ],
    default: false,
    new: false,
    experimental: false,
    reload: false,
  },
  THEME_ANIMATION_INTENSITY: {
    mode: "slider",
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
      { value: true, text: "ON" },
      { value: false, text: "OFF" },
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
/**
 * The user's settings
 * @typedef {Object} UserSettings
 * @property {string} GRADE_LEVEL - The grade level setting
 * @property {boolean} EXTRA_PERIODS - The extra periods setting
 * @property {boolean} SIXTH_PERIOD - The sixth period setting
 * @property {boolean} ZERO_PERIOD - The zero period setting
 * @property {boolean} TWENTY_FOUR_HOUR - The 24 hour setting
 * @property {boolean} AM_PM - The AM/PM setting
 * @property {boolean} INLINE_DETAILS - The inline details setting
 * @property {number} COLOR_THEME - The color theme setting
 * @property {boolean} THEME_ANIMATION - The theme animation setting
 * @property {number} THEME_ANIMATION_INTENSITY - The theme animation intensity setting
 * @property {string} LANGUAGE - The language setting
 * @property {boolean} NOTIFICATIONS_TOGGLE - The notifications toggle setting
 * @property {string} NOTIFICATIONS_START - The notifications start setting
 * @property {string} NOTIFICATIONS_END - The notifications end setting
 */
/** @type {UserSettings} */
export let userSettings = JSON.parse(localStorage.getItem("settings"));
if (userSettings == null) {
  userSettings = Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, value.default]));

  // Send a message for the extension to pick up on when the settings change
  window.postMessage({ settingsChanged: true });
  localStorage.setItem("settings", JSON.stringify(userSettings));
}
