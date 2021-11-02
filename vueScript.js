import { formattedJSON } from "./scheduleFormatting.js";
import { storage } from "./storage.js";

//stores the user preference for how they display time
var timeFormat = (storage.twentyFourHour ? "HH" : "h") + ":mm" + (storage.showAMPM ? " aa" : "");
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

function startTimer() {
  console.log("STARt");
  setInterval(boop(), 5);
}

function boop() {
  console.log("boop!");
}

var currentPeriod = null;
var periodList = formattedJSON.map(p => { return PeriodComponent(p.name, p.start, p.end, p.passing) });
periodList.forEach(p => p.isCurrent());

PetiteVue.createApp({
  //Components
  PeriodComponent,

  //Variables
  currentPage,
  periodList,
  listCount: 0,
  getListCount() {
    this.listCount++;
    return this.listCount % 2 == 0;
  },
  currentPeriod,
  timeLeft: currentPeriod.end.diff(moment(), 'minutes') + 1,
  percentCompleted() {
    return Math.trunc(100 - this.timeLeft / currentPeriod.end.diff(currentPeriod.start, 'minutes') * 100);
  },

  //Functions
  switchToNowPage,
  switchToCalendarPage,
  switchToSettingsPage,
  startTimer
}).mount();

function PeriodComponent(setName, setStart, setEnd, setPassing) {
  return {
    name: setName,
    start: moment(setStart, "hh:mm aa"), //formats from the json
    end: moment(setEnd, "hh:mm aa"),
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
    }
  };
}
