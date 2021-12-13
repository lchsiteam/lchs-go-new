// Default settings JSON
const defaultSettings = {
  settings: {
    setting: "settings",
    notificationsOn: true,
    enableAnimations: true,
    showExtraPeriods: false,
    sixthEnabled: true,
    zeroEnabled: true,
    twentyFourHour: false,
    showAMPM: false,
    colorTheme: '1',
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
  notificationsOn: {                         // setting id (same as ^)
    setting: "notificationsOn",              // setting id (same as ^)
    key: "NOTIFICATION",                     // language translation key
    mode: 'toggle',                          // setting type
    options: [[true, "ON"], [false, "OFF"]], // options for the setting array of arrays [ [<set to value>, <language key for display>] , ... ]
    new: false,
    experimental: true,
  },
  enableAnimations: {
    setting: "enableAnimations",
    key: "ANIMATIONS",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: true,
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