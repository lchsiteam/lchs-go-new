const defaultConfig = {
  settings: {
    notificationsOn: true,
    enableAnimations: true,
    enableThemeAnimations: true,
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

export var storage = JSON.parse(localStorage.getItem("settings"));
// if (storage == null) {
  storage = defaultConfig.settings;
  localStorage.setItem("settings", JSON.stringify(storage));
// }