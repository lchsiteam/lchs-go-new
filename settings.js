// Default settings JSON
const defaultSettings = {
  settings: {
    setting: "settings",
    showExtraPeriods: false,
    sixthEnabled: true,
    zeroEnabled: true,
    twentyFourHour: false,
    showAMPM: false,
    inlinePeriodDetails: true,
    // showWeekends: true,
    colorTheme: 3,
    grade: 'GRADE_9',
    language: 'ENGLISH'
  }
}

// Export the current settings JSON
export var settings = JSON.parse(localStorage.getItem("settings"));
if (settings == null) {
  settings = defaultSettings.settings;
  localStorage.setItem("settings", JSON.stringify(settings));
}

// Settings menu data
export const settingsMenu = {
  grade: {
    setting: "grade",
    key: "GRADE_LEVEL",
    mode: 'dropdown',
    options: ["GRADE_7", "GRADE_8", "GRADE_9", "GRADE_10", "GRADE_11", "GRADE_12"],
    new: false,
    experimental: false,
    reload: true,
  },
  showExtraPeriods: {
    setting: "showExtraPeriods",
    key: "EXTRA_PERIODS",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: true,
  },
  sixthEnabled: {
    setting: "sixthEnabled",
    key: "SIXTH_PERIOD",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: false,
    reload: false,
  },
  zeroEnabled: {
    setting: "zeroEnabled",
    key: "ZERO_PERIOD",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: false,
    reload: false,
  },
  twentyFourHour: {
    setting: "twentyFourHour",
    key: "TWENTY_FOUR_HOUR",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: false,
    reload: false,
  },
  showAMPM: {
    setting: "showAMPM",
    key: "AM_PM",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: false,
    reload: false,
  },
  inlinePeriodDetails: {
    setting: "inlinePeriodDetails",
    key: "INLINE_DETAILS",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: false,
    reload: false,
  },
  // showWeekends: {
  //   setting: "showWeekends",
  //   key: "SHOW_WEEKENDS",
  //   mode: 'toggle',
  //   options: [[true, "ON"], [false, "OFF"]],
  //   new: false,
  //   experimental: false,
  // },
  colorTheme: {
    setting: "colorTheme",
    key: "COLOR_THEME",
    mode: 'color-slider',
    new: true,
    experimental: false,
    reload: false,
  },
  language: {
    setting: "language",
    key: "LANGUAGE",
    mode: 'dropdown',
    options: ["ENGLISH", "SPANISH", "GERMAN", "FRENCH", "ITALIAN", "LOLCAT"],
    new: true,
    experimental: true,
    reload: true,
  }
}