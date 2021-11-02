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

var currentPeriod = null;

PetiteVue.createApp({
  //Components
  PeriodComponent,

  //Variables
  currentPage,
  currentPeriod() {
    return currentPeriod;
  },
  formattedJSON,

  //Functions
  switchToNowPage,
  switchToCalendarPage,
  switchToSettingsPage
}).mount();

function PeriodComponent(props) {
  return {
    name: props.name,
    start: moment(props.start, "hh:mm aa"), //formats from the json
    end: moment(props.end, "hh:mm aa"),
    isCurrent() {
      console.log(currentPeriod);
      var now = moment();
      if (this.start < now && now < this.end) {
        currentPeriod = this;
        return true;
      }
      return false;
    },
    getStart() {
      return this.start.format(timeFormat);
    },
    getEnd() {
      return this.end.format(timeFormat);
    }
  };
}
