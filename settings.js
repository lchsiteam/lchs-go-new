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
    colorTheme: '',
    grade: 9,
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
  notificationsOn: {                         // setting id (same as ^)
    setting: "notificationsOn",              // setting id (same as ^)
    key: "NOTIFICATION",                     // language translation key
    mode: 'toggle',                          // setting type
    options: [[true, "ON"], [false, "OFF"]], // options for the setting array of arrays [ [<set to value>, <language key for display>] , ... ]
    new: false,
  },
  enableAnimations: {
    setting: "enableAnimations",
    key: "ANIMATIONS",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
  },
  showExtraPeriods: {
    setting: "showExtraPeriods",
    key: "EXTRA_PERIODS",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
  },
  sixthEnabled: {
    setting: "sixthEnabled",
    key: "SIXTH_PERIOD",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
  },
  zeroEnabled: {
    setting: "zeroEnabled",
    key: "ZERO_PERIOD",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
  },
  twentyFourHour: {
    setting: "twentyFourHour",
    key: "TWENTY_FOUR_HOUR",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
  },
  showAMPM: {
    setting: "showAMPM",
    key: "AM_PM",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
  },
  colorTheme: {
    setting: "colorTheme",
    key: "COLOR_THEME",
    mode: 'color-slider',
    new: true,
  },
  grade: {
    setting: "grade",
    key: "GRADE_LEVEL",
    mode: 'dropdown',
    options: ["GRADE_7", "GRADE_8", "GRADE_9", "GRADE_10", "GRADE_11", "GRADE_12"],
    new: false,
  },
  language: {
    setting: "language",
    key: "LANGUAGE",
    mode: 'dropdown',
    options: ["ENGLISH", "SPANISH", "GERMAN", "FRENCH"],
    new: true,
  }
}