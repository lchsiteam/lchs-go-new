import { scheduleType, formattedJSON, translateWithInsert, translate, } from "./scheduleFormatting.js";
import { settings } from "./settings.js";

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

var currentPeriod = null;
var periodList = formattedJSON.map((p) => {
  return PeriodComponent(p.name, p.start, p.end, p.passing);
});
periodList.forEach((p) => p.isCurrent());

PetiteVue.createApp({
  //Components
  PeriodComponent,

  //Variables
  currentPage,
  periodList,
  todaysGreeting: "",
  listCount: 0,
  getListCount() {
    this.listCount++;
    return this.listCount % 2 == 0;
  },
  currentPeriod,
  currentTime: 0,
  timeLeft: 0,
  percentCompleted: 0,
  percentCompletedText: "",

  //Functions
  switchToNowPage,
  switchToCalendarPage,
  switchToSettingsPage,
  startTimer() {
    this.update();
    setInterval(() => {
      this.update();
    }, 5000);
  },
  update() {
    if (!currentPeriod.isCurrent) {
      periodList.forEach((p) => p.isCurrent());
    }

    this.todaysGreeting = getTodaysGreeting();
    this.timeLeft = currentPeriod.end.diff(moment(), "minutes") + 1;
    this.percentCompleted = 100 - (this.timeLeft / currentPeriod.end.diff(currentPeriod.start, "minutes")) * 100;
    this.percentCompletedText = translateWithInsert( "PERCENT_COMPLETED", Math.trunc(this.percentCompleted));
    this.currentTime = moment().format(timeFormat);
    document.title = this.timeLeft + "min. | LCHS Go";
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
        currentPeriod = this;
        return true;
      }
      return false;
    },
    getName() {
      return this.name;
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

export function getTodaysGreeting() {
  return (
    getGreeting() +
    " " +
    translateWithInsert("TODAY_IS", translate(scheduleType))
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
