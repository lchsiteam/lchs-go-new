// Importing the Schedule, Settings, and Languages
import {formattedJSON, languageJSON, scheduleJSON, getSchedule, getEvent, TIMEZONE } from "./scheduleFormatting.js";
import { settings, settingsMenu } from "./settings.js";
import { customNames, namesMenu } from "./classNames.js";

var timeOffeset = dayjs.tz(scheduleJSON.timeOffset, "HH:mm:ss", TIMEZONE).local();

// Stores the user preference for how they display time
var timeFormat = (settings.twentyFourHour ? "HH" : "h") + ":mm" + (settings.showAMPM ? " A" : "");

// Find current Period
var currentPeriod = null;
var periodListComponent = PeriodListComponent(formattedJSON, false);

// Stores if a notification has been sent already
var notified = false;

periodListComponent.listPeriod.forEach((p) => {
        if(p.isCurrent()) {
          currentPeriod = p;
        }});

// Petite Vue interface
PetiteVue.createApp({
  // Components
  PeriodInformationComponent,
  PeriodListComponent,
  CalendarDay,

  // All Pages
  currentPage: 'now',
  backgroundColor: "hsl( 0, 50, 50)",
  updatePage: true,

  // Now Page
  // periodList,
  periodListComponent,
  todaysGreeting: "",
  listCount: 0,
  getListCount() {
    this.listCount++;
    return this.listCount % 2 == 0;
  },
  currentPeriod,
  currentTime: 0,
  minutesLeft: 0,
  percentCompleted: 0,
  percentCompletedText: "",

  // Calendar Page
  showPopup: false,
  // popupSchedule: periodList,
  popupDate: null,
  monthOffset: 0,
  calendarToggle: true,

  // Settings Page
  settingsMenu,
  settings,
  changedSetting: true,
  shareLink: "",
  
  // Class Names Page
  namesMenu,
  customNames,

  // Functions
  switchPage(page) {
    if (page == 'now' || page == 'calendar' || page == 'settings' || page == 'classNames' || page == 'data')
      this.currentPage = page;
    else {
      this.currentPage = 'now';
    }
    this.popupDate = null;

    window.history.pushState("", this.currentPage, "/?" + this.currentPage);
    if (window.innerWidth <= 767) {
      if (page == 'now') {
        let el = document.getElementsByClassName("period-details-small")[0];
        if (el != null) el.scrollIntoView({behavior: "smooth", block: "center"});
      }
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
    var url = new URLSearchParams(location.search);
    var startReload = false;
    if (url.has("setSettings")) {
      localStorage.setItem("settings", url.get("setSettings"));
      startReload = true;
    }
    if (url.has("setClassNames")) {
      localStorage.setItem("customNamesJSON", url.get("setClassNames"));
      startReload = true;
    }
    if (url.has("calendar")) {
      this.switchPage("calendar");
    } else if (url.has("settings")) {
      this.switchPage("settings");
    } else if (url.has("classNames")) {
      this.switchPage("classNames");
    } else if (url.has("data")) {
      this.switchPage("data");
    } else {
      this.switchPage("now");
    }
    if (startReload) location.reload();

    changeHue(settings.colorTheme);
    this.update();

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.update();
    }, 5000);
  },
  update() {
    if (!this.currentPeriod.isCurrent()) {
      if (this.currentPeriod.start.day() != dayjs().day()) {
        location.reload();
     }
      // location.reload();
      this.updatePage = false;
      periodListComponent.listPeriod.forEach((p) => {
        if(p.isCurrent()) {
          this.currentPeriod = p;
        }});

      setTimeout(() => { this.updatePage = true; }, 10);
      // console.log("new Period");
      // periodList.forEach((p) => {
      //   if(p.isCurrent()) {
      //     currentPeriod = p;
      //   }});
      // periodList = periodList;
      notified = false;
    }

    this.todaysGreeting = getTodaysGreeting();
    this.minutesLeft = this.currentPeriod.end.diff(dayjs().subtract(timeOffeset.hour(), 'hour').subtract(timeOffeset.minute(), 'minute').subtract(timeOffeset.second(), 'second'), "minutes") + 1;
    this.percentCompleted = Math.trunc(100 - (this.minutesLeft / this.currentPeriod.end.diff(this.currentPeriod.start, "minutes")) * 100);
    this.percentCompletedText = translateWithInsert( "PERCENT_COMPLETED", this.percentCompleted);
    this.currentTime = dayjs().format(timeFormat);
    document.title = (this.minutesLeft >= 60 ? (Math.trunc(this.minutesLeft / 60) + "hr. ") : "") + this.minutesLeft % 60 + "min. | LCHS Go";
    sendNotification(this.currentPeriod, this.minutesLeft);
  },
}).mount();

// Component - Period - Holds the name, start, end, and if passing
function PeriodComponent(setName, setStart, setEnd, setPassing) {
  var varStart = dayjs(setStart, "hh:mm A"); //formats from the json
  var varEnd = dayjs(setEnd, "hh:mm A");

  return {
    name: setName,
    start: varStart,
    end: varEnd,
    passing: setPassing,
    getStart() { return varStart.format(timeFormat) },
    getEnd() { return varEnd.format(timeFormat) },
    isCurrent() {
      var now = dayjs().subtract(timeOffeset.hour(), 'hour').subtract(timeOffeset.minute(), 'minute').subtract(timeOffeset.second(), 'second');
      return now.isBetween(this.start, this.end)
    },
    isVisible() {
      if (this.isCurrent() || settings.showExtraPeriods) {
        return true;
      } else {
        if (this.name == 'PERIOD_0' && !settings.zeroEnabled) {
          return false;
        } else if (this.name == 'PERIOD_6' && !settings.sixthEnabled) {
          return false;
        } else if (setPassing) {
          return false;
        } else {
          return true;
        }
      }
    },
    getName() {
      if (this.passing) {
        let tempName = this.name.split(',');
        return translateWithInsert(tempName[0], translate(tempName[1]));
      }
      return translate(this.name);
    },
  };
}

// Component - CalendarDay - Holds the schedule for the day and the date
function CalendarDay(day,monthOffset) {

  var dateS = dayjs().month(dayjs().month() + monthOffset).startOf('month')

  var dateM = dateS.set('date', day - dateS.day())
  return {
    date: dateM,
    schedule: getSchedule(dateM),
    event: getEvent(dateM)
  }
}

// Component - Period Information Template - Used to make a period information block
function PeriodInformationComponent(props) {
  return {
    $template: "#period-information-template"
  }
}

// Component - Period List Template - Used to make a period list block
function PeriodListComponent(periods, isCal) {
  var periodList = periods.map((p) => {
    return PeriodComponent(p.name, p.start, p.end, p.passing);
  });
  return {
    isCalendar: isCal,
    listPeriod: periodList,
    $template: "#period-list-template"
  }
}

// Function - Get the translated greeting and schedule for the day
export function getTodaysGreeting() {
  return (
    getGreeting() +
    " " +
    translateWithInsert("TODAY_IS", translate(formattedJSON.scheduleType))
  );
}

// Function - Get the translated current month for the calendar
export function getMonthText(month) {
  var monthsDict = {
    0 : "JANUARY",
    1 : "FEBURARY",
    2 : "MARCH",
    3 : "APRIL",
    4 : "MAY",
    5 : "JUNE",
    6 : "JULY",
    7 : "AUGUST",
    8 : "SEPTEMBER",
    9 : "OCTOBER",
    10 : "NOVEMBER",
    11 : "DECEMBER",
  }
  return (
    translate(monthsDict[dayjs().month(month).month()])
  );
}

// Function - Get the time of day for the greeting
function getGreeting() {
  var hours = dayjs().hour();

  if (hours < 12) {
    return translate("MORNING");
  } else if (hours < 18) {
    return translate("AFTERNOON");
  } else {
    return translate("EVENING");
  }
}

// Function - Set the local storage settings with an updated user setting
function changeSetting(setting, value) {
  settings[setting] = value;
  this.changedSetting = !this.changedSetting;

  // Send a message for the extension to pick up on when the settings change
  window.postMessage({settingsChanged: true});

  localStorage.setItem("settings", JSON.stringify(settings));

  timeFormat = (settings.twentyFourHour ? "HH" : "h") + ":mm" + (settings.showAMPM ? " A" : "");
  
  if (setting == "notificationToggle" && value) {
      if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert(translate("NOTIFY_UNSUPPORTED"));
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification("LCHS Go", { body: translate("NOTIFY_ENABLED"), icon: "/faviconLarge.png" } );
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("LCHS Go", { body: translate("NOTIFY_ENABLED"), icon: "/faviconLarge.png" } );
          // …
        }
      });
    }
  }
  
}

// Function - Called by the HTML to set the background color
function changeHue(hue) {
  var value = hslToHex(hue, 50, 50);
  document.getElementById("body").style.color = 'white';
  if (hue == 0) {
    document.getElementById("body").style.color = 'black';
    value = hslToHex(0, 0, 90);
  } else if (hue == 360) {
    value = hslToHex(0, 0, 25);
  } else if (hue == 359) {
    value = hslToHex(0, 0, 0);
  }
  document.getElementById("background").style.backgroundColor = value;

  var canvas = document.createElement('canvas');
  canvas.width = 48;canvas.height = 48;
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.src = '/faviconClear.png';
  img.onload = function() {
      ctx.fillStyle = value;
      ctx.beginPath();
      ctx.arc(24, 24, 24, 0, 2 * Math.PI);
      ctx.fill();
      if (hue == 0) {
        ctx.filter = 'invert(1)';
      }
      ctx.drawImage(img, 0, 0);

      var link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = canvas.toDataURL("image/x-icon");
      document.getElementsByTagName('head')[0].appendChild(link);
  }

  // var iconImage
  // if (settings.colorTheme == 0)
  //   iconImage = "/favicons/favicon0.ico"
  // else if (settings.colorTheme >= 359)
  //   iconImage = "/favicons/favicon18.ico"
  // else
  //   iconImage = ("/favicons/favicon" + Math.floor(settings.colorTheme / 360 * 17 + 1) + ".ico");
  // changeIcon(iconImage);
}

var prevTime = Date.now();
function themeChange() {
  if (Date.now() - prevTime < 100) {
    document.getElementById("background").style.backgroundColor = "";
    document.getElementById("background").style.backgroundImage = "linear-gradient(0,rgba(255, 0, 0, 1) 0%,rgba(255, 154, 0, 1) 10%,rgba(208, 222, 33, 1) 20%,rgba(79, 220, 74, 1) 30%,rgba(63, 218, 216, 1) 40%,rgba(47, 201, 226, 1) 50%,rgba(28, 127, 238, 1) 60%,rgba(95, 21, 242, 1) 70%,rgba(186, 12, 248, 1) 80%,rgba(251, 7, 217, 1) 90%,rgba(255, 0, 0, 1) 100%)"
  }
  prevTime = Date.now()
}

// Function - Helper for ^ to change HSL to Hex
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function changeIcon(src) {
  var link = document.createElement('link'),
    oldLink = document.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.href = src;
  if (oldLink) {
  document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
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
  window.postMessage({namesChanged: true});

  localStorage.setItem("customNamesJSON", JSON.stringify(customNames));
}

function shareSettings() {
  var link = new URL(location.origin);
  link.searchParams.set("setSettings", JSON.stringify(settings));
  this.shareLink = link.href + "&settings";
}

function shareClassNames() {
  var link = new URL(location.origin);
  link.searchParams.set("setClassNames", JSON.stringify(customNames));
  this.shareLink = link.href + "&settings";
}

// Function - Used to translate a key to the selected language.
export function translate(translateText) {
  if (customNames[translateText] != null) {
    return customNames[translateText];
  } else {
    return translateNoCustom(translateText);
  }
}

export function translateNoCustom(translateText) {
  if (languageJSON[translateText] == null) {
    return translateText;
  } else {
    return languageJSON[translateText];
  }
}

// Function - Used to translate a key to the selected language and insert other text if possible.
export function translateWithInsert(translateText, insertString) {
  var returnText = translate(translateText);
  var index = returnText.indexOf("{}");
  if (index < 0) {
    return translate(translateText);
  }
  return returnText.slice(0, index) + insertString + returnText.slice(index + 2);
}

// Notify the user before period starts or ends
export function sendNotification(period, timeLeft) {
  if (settings.notificationToggle && !notified) {
    var nextPeriod = null;
    periodListComponent.listPeriod.forEach((p) => {
      if(p.getStart() == period.getEnd()) {
        nextPeriod = p;
    }});
    if (nextPeriod && !nextPeriod.passing && nextPeriod.isVisible() && timeLeft == parseInt(settings.notificationStart)) { // period start notif
      const notification = new Notification("LCHS Go", { body: nextPeriod.getName() + translateWithInsert("NOTIFY_START", translate(settings.notificationStart)), icon: "/faviconLarge.png" } );
      notified = true;
    }
    else if (!period.passing && period.isVisible() && timeLeft == parseInt(settings.notificationEnd)) { // period end notif
      const notification = new Notification("LCHS Go", { body: period.getName() + translateWithInsert("NOTIFY_END", translate(settings.notificationEnd)), icon: "/faviconLarge.png" } );
      notified = true;
    }
  }
}

export function mod(bigNum, smallNum) {
  var output;
  if (bigNum < 0){
    output = smallNum - (-bigNum % smallNum)
  } else {
    output = bigNum % smallNum
  }
  return output
}
