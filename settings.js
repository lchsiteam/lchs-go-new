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

export var settings = JSON.parse(localStorage.getItem("settings"));
if (settings == null) {
  settings = defaultSettings.settings;
  localStorage.setItem("settings", JSON.stringify(settings));
}

class LCHSGoTheme {
id = 0;
name = "";
color = '#42b983';

constructor(id, name, color) {
  this.id = id;
  this.name = name;
  this.color = color;
}
}

const themes = [
  new LCHSGoTheme(0, "AHHH", "#122363"),
  new LCHSGoTheme(1, "fdfd", "#111111")
]

export const settingsMenu = {
  notificationsOn: {
    setting: "notificationsOn",
    key: "NOTIFICATION",
    mode: 'toggle',
    options: [["ON", true], ["OFF", false]],
    new: false,
  },
  enableAnimations: {
    setting: "enableAnimations",
    key: "ANIMATIONS",
    mode: 'toggle',
    options: [["ON", true], ["OFF", false]],
    new: false,
  },
  showExtraPeriods: {
    setting: "showExtraPeriods",
    key: "EXTRA_PERIODS",
    mode: 'toggle',
    options: [["ON", true], ["OFF", false]],
    new: false,
  },
  sixthEnabled: {
    setting: "sixthEnabled",
    key: "SIXTH_PERIOD",
    mode: 'toggle',
    options: [["ON", true], ["OFF", false]],
    new: false,
  },
  zeroEnabled: {
    setting: "zeroEnabled",
    key: "ZERO_PERIOD",
    mode: 'toggle',
    options: [["ON", true], ["OFF", false]],
    new: false,
  },
  twentyFourHour: {
    setting: "twentyFourHour",
    key: "TWENTY_FOUR_HOUR",
    mode: 'toggle',
    options: [["ON", true], ["OFF", false]],
    new: false,
  },
  showAMPM: {
    setting: "showAMPM",
    key: "AM_PM",
    mode: 'toggle',
    options: [["ON", true], ["OFF", false]],
    new: false,
  },
  colorTheme: {
    setting: "colorTheme",
    key: "COLOR_THEME",
    mode: 'dropdown',
    options: themes.map(t => t.id),
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