// Default settings JSON
const defaultSettings = {
  settings: {
    setting: "settings",
    showExtraPeriods: false,
    sixthEnabled: true,
    zeroEnabled: true,
    twentyFourHour: false,
    showAMPM: false,
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
  },
  zeroEnabled: {
    setting: "zeroEnabled",
    key: "ZERO_PERIOD",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: false,
  },
  twentyFourHour: {
    setting: "twentyFourHour",
    key: "TWENTY_FOUR_HOUR",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: false,
  },
  showAMPM: {
    setting: "showAMPM",
    key: "AM_PM",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: false,
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
  },
  language: {
    setting: "language",
    key: "LANGUAGE",
    mode: 'dropdown',
    options: ["ENGLISH", "SPANISH", "GERMAN", "FRENCH"],
    new: true,
    experimental: true,
  }
}