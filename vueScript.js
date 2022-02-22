// Importing the Schedule, Settings, and Languages
import {formattedJSON, eventsJSON, languageJSON, getSchedule } from "./scheduleFormatting.js";
import { settings, settingsMenu } from "./settings.js";

// Basically and import
var customNames = JSON.parse(localStorage.getItem("customNamesJSON"));
if (customNames == null) {
  customNames = {};
}

// Stores the user preference for how they display time
var timeFormat = (settings.twentyFourHour ? "HH" : "h") + ":mm" + (settings.showAMPM ? " A" : "");

// Find current Period
var currentPeriod = null;
var periodListComponent = PeriodListComponent(formattedJSON);

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

  // Settings Page
  settingsMenu,
  settings,
  changedSetting: true,

  // Functions
  switchToNowPage,
  switchToCalendarPage,
  switchToSettingsPage,
  switchToChange,
  changeSetting,
  changeHue,
  changeClassName,
  translateWithInsert, 
  translate,

  // Update interval timer
  interval: null,
  startTimer() {
    this.update();
    changeHue(settings.colorTheme);

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.update();
    }, 5000);
  },
  update() {
    if (!currentPeriod.isCurrent()) {
      location.reload();
      // console.log("new Period");
      // periodList.forEach((p) => {
      //   if(p.isCurrent()) {
      //     currentPeriod = p;
      //   }});
      // periodList = periodList;
    }

    this.todaysGreeting = getTodaysGreeting();
    this.minutesLeft = currentPeriod.end.diff(dayjs(), "minutes") + 1;
    this.percentCompleted = 100 - (this.minutesLeft / currentPeriod.end.diff(currentPeriod.start, "minutes")) * 100;
    this.percentCompletedText = translateWithInsert( "PERCENT_COMPLETED", Math.trunc(this.percentCompleted));
    this.currentTime = dayjs().format(timeFormat);
    document.title = this.minutesLeft + "min. | LCHS Go";
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
    getStart: varStart.format(timeFormat),
    getEnd: varEnd.format(timeFormat),
    isCurrent() {
      var now = dayjs();
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
function CalendarDay(props) {
  var dateM = dayjs().set('date', props.num - dayjs().startOf('month').day());
  return {
    date: dateM,
    schedule: getSchedule(dateM),
    event: eventsJSON[dateM.year()][dayjs.months()[dateM.month()]][dateM.date()]
  }
}

// Component - Period Information Template - Used to make a period information block
function PeriodInformationComponent(props) {
  return {
    $template: "#period-information-template"
  }
}

// Component - Period List Template - Used to make a period list block
function PeriodListComponent(periods) {
  var periodList = periods.map((p) => {
    return PeriodComponent(p.name, p.start, p.end, p.passing);
  });
  return {
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

// Function - Page switching
function switchToNowPage() {
  this.currentPage = "now";
}
function switchToCalendarPage() {
  this.currentPage = "calendar";
}
function switchToSettingsPage() {
  this.currentPage = "settings";
}
function switchToChange(){
  this.currentPage = "change"
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