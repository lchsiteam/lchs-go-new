// Importing the Schedule, Settings, and Languages
import {formattedJSON, languageJSON, scheduleJSON, getSchedule, getEvent } from "./scheduleFormatting.js";
import { settings, settingsMenu } from "./settings.js";

// Basically and import
var customNames = JSON.parse(localStorage.getItem("customNamesJSON"));
if (customNames == null) {
  customNames = {};
}

var timeOffeset = dayjs(scheduleJSON.timeOffset, "HH:mm:ss");

// Stores the user preference for how they display time
var timeFormat = (settings.twentyFourHour ? "HH" : "h") + ":mm" + (settings.showAMPM ? " A" : "");

// Find current Period
var currentPeriod = null;
var periodListComponent = PeriodListComponent(formattedJSON, false);

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

  // Functions
  switchPage(page) {
    if (page == 'now' || page == 'calendar' || page == 'settings')
      this.currentPage = page;
    else {
      this.currentPage = 'now';
    }

    window.history.pushState("", this.currentPage, "/?" + this.currentPage);
    // location.search = currentPage;
  },
  changeSetting,
  changeHue,
  changeClassName,
  translateWithInsert, 
  translate,
  getMonthText,
  mod,

  // Update interval timer
  interval: null,
  startTimer() {
    var url = new URLSearchParams(location.search);
    this.switchPage(url.keys().next().value);
    this.update();
    changeHue(settings.colorTheme);

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.update();
    }, 5000);
  },
  update() {
    if (!this.currentPeriod.isCurrent()) {
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
    }

    this.todaysGreeting = getTodaysGreeting();
    this.minutesLeft = this.currentPeriod.end.diff(dayjs(), "minutes") + 1;
    this.percentCompleted = 100 - (this.minutesLeft / this.currentPeriod.end.diff(this.currentPeriod.start, "minutes")) * 100;
    this.percentCompletedText = translateWithInsert( "PERCENT_COMPLETED", Math.trunc(this.percentCompleted));
    this.currentTime = dayjs().format(timeFormat);
    document.title = (this.minutesLeft >= 60 ? (Math.trunc(this.minutesLeft / 60) + "hr. ") : "") + this.minutesLeft % 60 + "min. | LCHS Go";
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
      var now = dayjs().add(timeOffeset.hour(), 'hour').add(timeOffeset.minute(), 'minute').add(timeOffeset.second(), 'second');
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
  localStorage.setItem("settings", JSON.stringify(settings));

  timeFormat = (settings.twentyFourHour ? "HH" : "h") + ":mm" + (settings.showAMPM ? " A" : "");
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
  }
  document.getElementById("background").style.backgroundColor = value;

  var iconImage
  if (settings.colorTheme == 0)
    iconImage = "/favicons/favicon0.ico"
  else if (settings.colorTheme == 360)
    iconImage = "/favicons/favicon18.ico"
  else
    iconImage = ("/favicons/favicon" + Math.floor(settings.colorTheme / 360 * 17 + 1) + ".ico");
  changeIcon(iconImage);
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
  localStorage.setItem("customNamesJSON", JSON.stringify(customNames));
}

// Function - Used to translate a key to the selected language.
export function translate(translateText) {
  if (customNames[translateText] != null) {
    return customNames[translateText];
  } else {
    if (languageJSON[translateText] == null) {
      return translateText;
    } else {
      return languageJSON[translateText];
    }
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

export function mod(bigNum, smallNum) {
  var output;
  if (bigNum < 0){
    output = smallNum - (-bigNum % smallNum)
  } else {
    output = bigNum % smallNum
  }
  return output
}