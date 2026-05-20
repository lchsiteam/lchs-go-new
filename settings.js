// Default settings JSON
function getDefaultSettings() {
  return {
    setting: "settings",
    showExtraPeriods: false,
    sixthEnabled: true,
    zeroEnabled: true,
    twentyFourHour: false,
    showAMPM: false,
    inlinePeriodDetails: true,
    // showWeekends: true,
    colorTheme: 3,
    themeAnimation: false,
    themeAnimationIntensity: 15,
    grade: 'GRADE_9',
    language: 'ENGLISH',
    notificationToggle: false,
    notificationStart: '3_MIN',
    notificationEnd: '2_MIN',
    hasSeenAnnouncement: false
  }
}

function validateSettings(settings) {

  const defaultSettings = getDefaultSettings();

  if (typeof settings.setting !== "string") settings.setting = defaultSettings.setting;
  if (typeof settings.showExtraPeriods !== "boolean") settings.showExtraPeriods = defaultSettings.showExtraPeriods;
  if (typeof settings.sixthEnabled !== "boolean") settings.sixthEnabled = defaultSettings.sixthEnabled;
  if (typeof settings.zeroEnabled !== "boolean") settings.zeroEnabled = defaultSettings.zeroEnabled;
  if (typeof settings.twentyFourHour !== "boolean") settings.twentyFourHour = defaultSettings.twentyFourHour;
  if (typeof settings.showAMPM !== "boolean") settings.showAMPM = defaultSettings.showAMPM;
  if (typeof settings.inlinePeriodDetails !== "boolean") settings.inlinePeriodDetails = defaultSettings.inlinePeriodDetails;
  // if (typeof settings.showWeekends !== "boolean") settings.showWeekends = defaultSettings.showWeekends;
  if (typeof settings.colorTheme !== "number") settings.colorTheme = defaultSettings.colorTheme;
  if (typeof settings.themeAnimation !== "boolean") settings.themeAnimation = defaultSettings.themeAnimation;
  if (typeof settings.themeAnimationIntensity !== "number") settings.themeAnimationIntensity = defaultSettings.themeAnimationIntensity;
  if (typeof settings.grade !== "string") settings.grade = defaultSettings.grade;
  if (typeof settings.language !== "string") settings.language = defaultSettings.language;
  if (typeof settings.notificationToggle !== "boolean") settings.notificationToggle = defaultSettings.notificationToggle;
  if (typeof settings.notificationStart !== "string") settings.notificationStart = defaultSettings.notificationStart;
  if (typeof settings.notificationEnd !== "string") settings.notificationEnd = defaultSettings.notificationEnd;
  if (typeof settings.hasSeenAnnouncement !== "boolean") settings.hasSeenAnnouncement = defaultSettings.hasSeenAnnouncement;

  return settings;

}

function loadSettings() {
  try {
    const raw = localStorage.getItem("settings");
    if (raw == null) {
      return getDefaultSettings();
    }
    const parsed = JSON.parse(raw);

    return validateSettings(parsed);
  }
  catch (e) {
    console.error("Error loading settings, resetting to default", e);
    localStorage.removeItem("settings");
    return getDefaultSettings();
  }
}

// Export the current settings JSON
export let settings = loadSettings();
localStorage.setItem("settings", JSON.stringify(settings));

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
    mode: "color-slider",
    max: 360,
    min: 0,
    new: false,
    experimental: false,
    reload: false,
  },
  themeAnimation: {
    setting: "themeAnimation",
    key: "THEME_ANIMATION",
    mode: "toggle",
    options: [
      [true, "ON"],
      [false, "OFF"],
    ],
    new: false,
    experimental: false,
    reload: true,
  },
  themeAnimationIntensity: {
    setting: "themeAnimationIntensity",
    key: "THEME_ANIMATION_INTENSITY",
    mode: "slider",
    max: 180,
    min: 10,
    new: false,
    experimental: false,
    reload: false,
  },
  language: {
    setting: "language",
    key: "LANGUAGE",
    mode: 'dropdown',
    options: ["ENGLISH", "SPANISH", "GERMAN", "FRENCH", "ITALIAN", "LOLCAT", "DEVELOPER"],
    new: true,
    experimental: true,
    reload: true,
  },
  notificationToggle: {
    setting: "notificationToggle",
    key: "NOTIFICATIONS_TOGGLE",
    mode: 'toggle',
    options: [[true, "ON"], [false, "OFF"]],
    new: false,
    experimental: true,
    reload: false,
  },
  notificationStart: {
    setting: "notificationStart",
    key: "NOTIFICATIONS_START",
    mode: 'dropdown',
    options: ["0_MIN", "1_MIN", "2_MIN", "3_MIN", "4_MIN", "5_MIN", "6_MIN", "7_MIN", "8_MIN", "9_MIN", "10_MIN", "OFF"],
    new: false,
    experimental: true,
    reload: false,
  },
  notificationEnd: {
    setting: "notificationEnd",
    key: "NOTIFICATIONS_END",
    mode: 'dropdown',
    options: ["0_MIN", "1_MIN", "2_MIN", "3_MIN", "4_MIN", "5_MIN", "6_MIN", "7_MIN", "8_MIN", "9_MIN", "10_MIN", "OFF"],
    new: false,
    experimental: true,
    reload: false,
  },
}
