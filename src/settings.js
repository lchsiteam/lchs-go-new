// Settings menu data
export const settings = new Map(
  Object.entries({
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
  })
);

// Export the current settings JSON
export let userSettings = JSON.parse(localStorage.getItem("settings"));
if (userSettings == null) {
  userSettings = new Map([...settings.entries()].map(([key, value]) => [key, value.default]));
  console.log(userSettings);
  localStorage.setItem("settings", JSON.stringify(userSettings));

  // Send a message for the extension to pick up on when the settings change
  window.postMessage({ settingsChanged: true });
}
