// Importing the Schedule, Settings, and Languages
import { formattedJSON, languageJSON, scheduleJSON, getSchedule, getEvent } from "./schedule.js";
import { userSettings, settings } from "./settings.js";

// Stores the user preference for how they display time
const timeOffeset = dayjs.tz(scheduleJSON.timeOffset, "HH:mm:ss", scheduleJSON.timezone).local();
let timeFormat = (userSettings.TWENTY_FOUR_HOUR ? "HH" : "h") + ":mm" + (userSettings.AM_PM ? " A" : "");

const rootStyle = document.querySelector(":root").style;
rootStyle.setProperty("--animated-background-intensity", settings.THEME_ANIMATION_INTENSITY + "deg");

// Export the current settings JSON
let customNames = JSON.parse(localStorage.getItem("customNamesJSON"));
if (!customNames) {
  customNames = {};
  window.postMessage({ namesChanged: true }); // Send a message for the extension to pick up on when the settings change
  localStorage.setItem("customNamesJSON", JSON.stringify(customNames));
}

// Find current Period
let currentPeriod = null;
let periodListComponent = PeriodListComponent(formattedJSON, false);

// Stores if a notification has been sent already
let notified = false;

periodListComponent.listPeriod.forEach((p) => {
  if (p.isCurrent()) {
    currentPeriod = p;
  }
});

export const Pages = {
  Now: "now",
  Calendar: "calendar",
  CalendarDay: "calendarDay",
  Settings: "settings",
  ClassNames: "classNames",
  Data: "data",
  values: () => Object.values(Pages).filter((v) => typeof v === "string"),
  contains: (page) => Pages.values().includes(page),
  filter: (filter) => Pages.values().filter(filter),
  map: (map) => Pages.values().map(map),
};

// Petite Vue interface
// Anything in here is accessible in the HTML
PetiteVue.createApp({
  // Components
  PeriodInformationComponent,
  PeriodListComponent,
  CalendarDay,

  // All Pages
  Pages,
  currentPage: Pages.Now,
  backgroundColor: "hsl( 0, 50, 50)",

  // Now Page
  periodListComponent,
  todaysGreeting: "",
  listCount: 0,
  getListCount() {
    return this.listCount++, this.listCount % 2 == 0;
  },
  currentPeriod,
  currentTime: 0,
  minutesLeft: 0,
  percentCompleted: 0,
  percentCompletedText: "",

  // Calendar Page
  showPopup: false,
  // popupSchedule: periodList,
  selectedCalendarDay: null,
  monthOffset: 0,
  calendarToggle: true,

  // Settings Page
  settings,
  userSettings,
  shareLink: "",

  // Class Names Page
  customNames,

  // Functions
  switchPage(page) {
    this.currentPage = Pages.contains(page) ? page : Pages.Now;
    this.popupDate = null;

    window.history.pushState("", this.currentPage, "/?" + this.currentPage);

    // If on smaller window scroll down to the period details box
    if (window.innerWidth <= 767 && page === Pages.Now) {
      let el = document.getElementsByClassName("period-details-small")[0];
      if (el != null) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  },
  changeSetting,
  changeHue,
  themeChange,
  changeClassName,
  translateWithInsert,
  translate,
  translateNoCustom,
  getMonthText,
  mod,
  shareSettings,
  shareClassNames,
  getEvent,

  // Update interval timer
  interval: null,
  startTimer() {
    const url = new URLSearchParams(location.search);
    let startReload = false;
    if (url.has("setSettings")) localStorage.setItem("settings", url.get("setSettings")), (startReload = true);
    if (url.has("setClassNames")) localStorage.setItem("customNamesJSON", url.get("setClassNames")), (startReload = true);

    const page = Pages.filter((p) => url.has(p))[0];
    if (page) this.switchPage(page);
    else this.switchPage(Pages.Now);

    if (startReload) location.reload();

    changeHue(userSettings.COLOR_THEME);
    this.update();

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.update();
    }, 5000);
  },
  update() {
    if (!this.currentPeriod.isCurrent()) {
      if (this.currentPeriod.start.day() != dayjs().day()) location.reload();

      periodListComponent.listPeriod.forEach((p) => {
        if (p.isCurrent()) {
          this.currentPeriod = p;
        }
      });
      notified = false;
    }

    this.todaysGreeting = getTodaysGreeting();
    this.minutesLeft = this.currentPeriod.end.diff(dayjs().subtract(timeOffeset.hour(), "hour").subtract(timeOffeset.minute(), "minute").subtract(timeOffeset.second(), "second"), "minutes") + 1;
    this.percentCompleted = Math.trunc(100 - (this.minutesLeft / this.currentPeriod.end.diff(this.currentPeriod.start, "minutes")) * 100);
    this.percentCompletedText = translateWithInsert("PERCENT_COMPLETED", this.percentCompleted);
    this.currentTime = dayjs().format(timeFormat);
    document.title = (this.minutesLeft >= 60 ? Math.trunc(this.minutesLeft / 60) + "hr. " : "") + (this.minutesLeft % 60) + "min. | LCHS Go";
    sendNotification(this.currentPeriod, this.minutesLeft);
  },
}).mount();

// Component - Period - Holds the name, start, end, and if passing
function PeriodComponent(setName, setStart, setEnd, setPassing) {
  const varStart = dayjs(setStart, "hh:mm A"); //formats from the json
  const varEnd = dayjs(setEnd, "hh:mm A");

  return {
    name: setName,
    start: varStart,
    end: varEnd,
    passing: setPassing,
    getStart() {
      return varStart.format(timeFormat);
    },
    getEnd() {
      return varEnd.format(timeFormat);
    },
    isCurrent() {
      const now = dayjs().subtract(timeOffeset.hour(), "hour").subtract(timeOffeset.minute(), "minute").subtract(timeOffeset.second(), "second");
      return now.isBetween(this.start, this.end);
    },
    isVisible() {
      if (this.isCurrent() || userSettings.EXTRA_PERIODS) return true;
      else {
        if (this.name == "PERIOD_0" && !userSettings.ZERO_PERIOD) return false;
        else if (this.name == "PERIOD_6" && !userSettings.SIXTH_PERIOD) return false;
        else if (setPassing) return false;
        else return true;
      }
    },
    getName() {
      if (this.passing) {
        let tempName = this.name.split(",");
        return translateWithInsert(tempName[0], translate(tempName[1]));
      }
      return translate(this.name);
    },
  };
}

// Component - CalendarDay - Holds the schedule for the day and the date
function CalendarDay(day, monthOffset) {
  var dateS = dayjs()
    .month(dayjs().month() + monthOffset)
    .startOf("month");

  var dateM = dateS.set("date", day - dateS.day());
  return {
    date: dateM,
    schedule: getSchedule(dateM),
    event: getEvent(dateM),
  };
}

// Component - Period Information Template - Used to make a period information block
function PeriodInformationComponent(props) {
  return {
    $template: "#period-information-template",
  };
}

// Component - Period List Template - Used to make a period list block
function PeriodListComponent(periods, isCal) {
  if (periods == null && isCal) return {};
  var periodList = periods
    .map((p) => {
      return PeriodComponent(p.name, p.start, p.end, p.passing);
    })
    .filter((p) => p.isVisible() || (p.isCurrent() && !isCalendar));
  return {
    isCalendar: isCal,
    listPeriod: periodList,
    $template: "#period-list-template",
  };
}

// Function - Get the translated greeting and schedule for the day
export function getTodaysGreeting() {
  return getGreeting() + " " + translateWithInsert("TODAY_IS", translate(formattedJSON.scheduleType));
}

// Function - Get the translated current month for the calendar
export function getMonthText(month) {
  var monthsDict = {
    0: "JANUARY",
    1: "FEBURARY",
    2: "MARCH",
    3: "APRIL",
    4: "MAY",
    5: "JUNE",
    6: "JULY",
    7: "AUGUST",
    8: "SEPTEMBER",
    9: "OCTOBER",
    10: "NOVEMBER",
    11: "DECEMBER",
  };
  return translate(monthsDict[dayjs().month(month).month()]);
}

// Function - Get the time of day for the greeting
function getGreeting() {
  var hours = dayjs().hour();

  if (hours < 12) return translate("MORNING");
  else if (hours < 18) return translate("AFTERNOON");
  else return translate("EVENING");
}

// Function - Set the local storage settings with an updated user setting
function changeSetting(setting, value) {
  userSettings[setting] = value;

  // Send a message for the extension to pick up on when the settings change
  window.postMessage({ settingsChanged: true });
  localStorage.setItem("settings", JSON.stringify(userSettings));
  timeFormat = (userSettings.TWENTY_FOUR_HOUR ? "HH" : "h") + ":mm" + (userSettings.AM_PM ? " A" : "");
  rootStyle.setProperty("--animated-background-intensity", userSettings.THEME_ANIMATION_INTENSITY + "deg");

  if (setting == "notificationToggle" && value) {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert(translate("NOTIFY_UNSUPPORTED"));
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification("LCHS Go", { body: translate("NOTIFY_ENABLED"), icon: "/faviconLarge.png" });
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("LCHS Go", { body: translate("NOTIFY_ENABLED"), icon: "/faviconLarge.png" });
          // …
        }
      });
    }
  }
}

// Function - Called by the HTML to set the background color
function changeHue(hue) {
  // Set the background color to the hue, with 50% saturation and 50% lightness
  var hslValue = [hue, 50, 50];
  rootStyle.setProperty("--text-color", "white");

  // Overrides for certain colors
  // Black text on white background
  if (hue == 0) {
    rootStyle.setProperty("--text-color", "black");
    hslValue = [0, 0, 90];
  }
  // Solid dark gray background for the last hue
  else if (hue == 360) hslValue = [0, 0, 25];
  // Solid black background for one off the last hue
  else if (hue == 359) hslValue = [0, 0, 0];

  const hslString = `hsl(${hslValue[0]} ${hslValue[1]}% ${hslValue[2]}%)`;
  rootStyle.setProperty("--background-color", hslString);

  /*
  This code is used to change the favicon color
  It works by drawing a colored circle on a canvas
  Then it draws the favicon on top of the circle
  Then it sets the favicon to the canvas using a data URL
  */
  var canvas = document.createElement("canvas");
  canvas.width = 48;
  canvas.height = 48;
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.src = "/public/faviconClear.png";
  img.onload = function () {
    ctx.fillStyle = hslString;
    ctx.beginPath();
    ctx.arc(24, 24, 24, 0, 2 * Math.PI);
    ctx.fill();
    if (hue == 0) ctx.filter = "invert(1)";

    ctx.drawImage(img, 0, 0);

    var link = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = canvas.toDataURL("image/x-icon");
    document.getElementsByTagName("head")[0].appendChild(link);
  };
}

/**
 * Function - Change the theme of the page based on the time of day
 */
var prevTime = Date.now();
function themeChange() {
  if (Date.now() - prevTime < 100) {
    rootStyle.setProperty("--background-color", "transparent");
    document.getElementById("background").style.backgroundImage = "linear-gradient(0,rgba(255, 0, 0, 1) 0%,rgba(255, 154, 0, 1) 10%,rgba(208, 222, 33, 1) 20%,rgba(79, 220, 74, 1) 30%,rgba(63, 218, 216, 1) 40%,rgba(47, 201, 226, 1) 50%,rgba(28, 127, 238, 1) 60%,rgba(95, 21, 242, 1) 70%,rgba(186, 12, 248, 1) 80%,rgba(251, 7, 217, 1) 90%,rgba(255, 0, 0, 1) 100%)";
  }
  prevTime = Date.now();
}

// Function - Update the local storage for the customNames to the new custom names
function changeClassName(periodId, element) {
  var newValue = element.value;
  if (newValue == languageJSON[periodId] || newValue == "") {
    newValue = languageJSON[periodId];
    delete customNames[periodId];
    element.value = newValue;
  } else {
    customNames[periodId] = newValue;
  }
  // Send a message to the extension to update custom names
  window.postMessage({ namesChanged: true });

  localStorage.setItem("customNamesJSON", JSON.stringify(customNames));
}

function shareSettings() {
  var link = new URL(location.origin);
  link.searchParams.set("setSettings", JSON.stringify(userSettings));
  this.shareLink = link.href + "&settings";
}

function shareClassNames() {
  var link = new URL(location.origin);
  link.searchParams.set("setClassNames", JSON.stringify(customNames));
  this.shareLink = link.href + "&settings";
}

/**
 * Function - Used to translate a key to the selected language.
 * @param {string} translateText - The key to translate.
 * @returns {string} - The translated text.
 */
export function translate(translateText) {
  if (customNames[translateText] != null) {
    return customNames[translateText];
  } else {
    return translateNoCustom(translateText);
  }
}

/**
 * Used to translate a key to the selected language without custom names.
 * @param {string} translateText - The key to translate.
 * @returns {string} - The translated text.
 */
export function translateNoCustom(translateText) {
  if (languageJSON[translateText] == null) {
    return translateText;
  } else {
    return languageJSON[translateText];
  }
}

/**
 * Function - Used to translate a key to the selected language and insert other text if possible.
 * @param {string} translateText - The key to translate.
 * @param {string} insertString - The string to insert if possible.
 * @returns {string} - The translated text.
 */
export function translateWithInsert(translateText, insertString) {
  var returnText = translate(translateText);
  var index = returnText.indexOf("{}");
  if (index < 0) return translate(translateText);
  return returnText.slice(0, index) + insertString + returnText.slice(index + 2);
}

// Notify the user before period starts or ends
export function sendNotification(period, timeLeft) {
  if (userSettings.NOTIFICATIONS_TOGGLE && !notified) {
    var nextPeriod = null;
    periodListComponent.listPeriod.forEach((p) => {
      if (p.getStart() == period.getEnd()) {
        nextPeriod = p;
      }
    });
    if (nextPeriod && !nextPeriod.passing && nextPeriod.isVisible() && timeLeft == parseInt(userSettings.NOTIFICATIONS_START)) {
      // period start notif
      const notification = new Notification("LCHS Go", { body: nextPeriod.getName() + translateWithInsert("NOTIFY_START", translate(userSettings.NOTIFICATIONS_START)), icon: "/faviconLarge.png" });
      notified = true;
    } else if (!period.passing && period.isVisible() && timeLeft == parseInt(userSettings.NOTIFICATIONS_END)) {
      // period end notif
      const notification = new Notification("LCHS Go", { body: period.getName() + translateWithInsert("NOTIFY_END", translate(userSettings.NOTIFICATIONS_END)), icon: "/faviconLarge.png" });
      notified = true;
    }
  }
}
