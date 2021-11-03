import { storage } from "./storage.js";
var scheduleJSON = JSON.parse(localStorage.getItem("scheduleJSON"));

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
      var serverScheduleJSON = JSON.parse(this.responseText);
      if (scheduleJSON == null || scheduleJSON.version < serverScheduleJSON.version) {
        localStorage.setItem("scheduleJSON", JSON.stringify(serverScheduleJSON));
        scheduleJSON = serverScheduleJSON;
      }
  }
};
xmlhttp.open("GET", "./schedule.json", true);
xmlhttp.send();

export var formattedJSON = [];
export var scheduleType;

getSchedule(new Date());
export function getSchedule(date) {  
  //Check if an override exists
  if (Object.keys(scheduleJSON.overrides).includes(date)) { // this doesn't work - find a way to format the date for the JSON using the Date class
    scheduleType = scheduleJSON.overrides[date.getDate()];
  } else {
    scheduleType = scheduleJSON.defaults[date.getDay()];
  }

  //add passing periods

  var previousEnd;
  if (storage.grade >= 9) {
    Object.keys(scheduleJSON.gradeLevels.highSchool[scheduleType]).forEach(period => {
      formattedJSON.push({
        name: translate("PASSING_BEFORE") + " " + translate(period),
        start: previousEnd,
        end: scheduleJSON.gradeLevels.highSchool[scheduleType][period][0],
        passing: true
      });
      formattedJSON.push({
        name: translate(period),
        start: scheduleJSON.gradeLevels.highSchool[scheduleType][period][0],
        end: scheduleJSON.gradeLevels.highSchool[scheduleType][period][1],
        passing: false
      });
      previousEnd = scheduleJSON.gradeLevels.highSchool[scheduleType][period][1];
    });
  }
}

function translate(text) {
  return scheduleJSON.languages[storage.language][text];
}