import {formattedJSON, eventsJSON, languageJSON, getSchedule } from "./scheduleFormatting.js";
import { settings, settingsMenu } from "./settings.js";

var customNames = JSON.parse(localStorage.getItem("customNamesJSON"));
if (customNames == null) {
  customNames = {};
}

//stores the user preference for how they display time
var timeFormat = (settings.twentyFourHour ? "HH" : "h") + ":mm" + (settings.showAMPM ? " A" : "");
var currentPage = "now";

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


var currentPeriod = null;
var periodList = formattedJSON.map((p) => {
  return PeriodComponent(p.name, p.start, p.end, p.passing);
});
periodList.forEach((p) => {
        if(p.isCurrent()) {
          currentPeriod = p;
        }});

PetiteVue.createApp({
  //Components
  PeriodInformationComponent,
  PeriodListComponent,
  CalendarDay,

  //All Pages
  currentPage: 'now',
  showPopup: false,
  backgroundColor: "hsl( 0, 50, 50)",

  //Now Page
  periodList,
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

  //Settings Page
  settingsMenu,
  settings,
  changedSetting: true,

  //Functions

  switchToNowPage,
  switchToCalendarPage,
  switchToSettingsPage,
  switchToChange,
  changeSetting,
  changeHue,
  changeClassName,
  translateWithInsert, 
  translate,
  interval: 0,
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
    this.minutesLeft = currentPeriod.end.diff(moment(), "minutes") + 1;
    this.percentCompleted = 100 - (this.minutesLeft / currentPeriod.end.diff(currentPeriod.start, "minutes")) * 100;
    this.percentCompletedText = translateWithInsert( "PERCENT_COMPLETED", Math.trunc(this.percentCompleted));
    this.currentTime = moment().format(timeFormat);
    document.title = this.minutesLeft + "min. | LCHS Go";
  },
}).mount();

function PeriodComponent(setName, setStart, setEnd, setPassing) {
  return {
    name: setName,
    start: moment(setStart, "hh:mm A"), //formats from the json
    end: moment(setEnd, "hh:mm A"),
    passing: setPassing,
    isCurrent() {
      var now = moment();
      if (this.start < now && now < this.end) {
        return true;
      }
      return false;
    },
    getName() {
      if (this.passing) {
        let tempName = this.name.split(',');
        return translateWithInsert(tempName[0], translate(tempName[1]));
      }
      return translate(this.name);
    },
    getStart() {
      return this.start.format(timeFormat);
    },
    getEnd() {
      return this.end.format(timeFormat);
    },
    isPassing() {
      return this.passing;
    },
  };
}

function CalendarDay(props) {
  return {
    date: moment().set('date', props.num - moment().startOf('month').day()),
    scheduleType() {
      return getSchedule(this.date);
    },
    event() {
      return eventsJSON[this.date.year()][moment.months()[this.date.month()]][this.date.date()];
    }
  }
}

function PeriodInformationComponent(props) {
  return {
    $template: "#period-information-template"
  }
}

function PeriodListComponent(props) {
  return {
    $template: "#period-list-template"
  }
}

export function getTodaysGreeting() {
  return (
    getGreeting() +
    " " +
    translateWithInsert("TODAY_IS", translate(formattedJSON.scheduleType))
  );
}

function getGreeting() {
  var hours = moment().hours();

  if (hours < 12) {
    return translate("MORNING");
  } else if (hours < 18) {
    return translate("AFTERNOON");
  } else {
    return translate("EVENING");
  }
}

function changeSetting(setting, value) {
  settings[setting] = value;
  this.changedSetting = !this.changedSetting;
  localStorage.setItem("settings", JSON.stringify(settings));
}

function changeHue(hue) {
  document.getElementById("background").style.backgroundColor = hslToHex(hue, 50, 50);
}

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

export function translate(translateText) {
  if (customNames[translateText] != null) {
    return customNames[translateText];
  } else {
    return languageJSON[translateText];
  }
}

export function translateWithInsert(translateText, insertString) {
  var returnText = translate(translateText);
  var index = returnText.indexOf("{}");
  if (index < 0) {
    return translate(translateText);
  }
  return returnText.slice(0, index) + insertString + returnText.slice(index + 2);
}