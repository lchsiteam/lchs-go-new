import { scheduleJSON } from "./scheduleFormatting.js";

const defaultSettings = {
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

export var settings = JSON.parse(localStorage.getItem("settings"));
if (settings == null) {
  settings = defaultSettings.settings;
  localStorage.setItem("settings", JSON.stringify(settings));
}

const settingsMenu = {
  notificationsOn: {
    title: "",
    description: "",
    mode: 'toggle',
    new: false,
  },
  enableAnimations: {
    title: "",
    description: "",
    mode: '',
    new: false,
  },
  enableThemeAnimations: {
    title: "",
    description: "",
    mode: '',
    new: false,
  },
  showExtraPeriods: {
    title: "",
    description: "",
    mode: '',
    new: false,
  },
  sixthEnabled: {
    title: "",
    description: "",
    mode: '',
    new: false,
  },
  zeroEnabled: {
    title: "",
    description: "",
    mode: '',
    new: false,
  },
  twentyFourHour: {
    title: "",
    description: "",
    mode: '',
    new: false,
  },
  showAMPM: {
    title: "",
    description: "",
    mode: '',
    new: false,
  },
  colorTheme: {
    title: "",
    description: "",
    mode: '',
    new: false,
  },
  grade: {
    title: "",
    description: "",
    mode: '',
    new: false,
  },
  language: {
    title: "",
    description: "",
    mode: '',
    new: false,
  }
}