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
var scheduleType;

getSchedule(new Date());
export function getSchedule(date) {  
  //Check if an override exists
  if (Object.keys(scheduleJSON.overrides).includes(date)) { // this doesn't work - find a way to format the date for the JSON using the Date class
    scheduleType = scheduleJSON.overrides[date.getDate()];
  } else {
    scheduleType = scheduleJSON.defaults[date.getDay()];
  }

  var previousEnd;
  if (storage.grade >= 9) {
    Object.keys(scheduleJSON.gradeLevels.highSchool[scheduleType]).forEach(period => {
      if (previousEnd != undefined) {
        formattedJSON.push({
          name: translate("PASSING_BEFORE") + " " + translate(period),
          start: previousEnd,
          end: scheduleJSON.gradeLevels.highSchool[scheduleType][period][0],
          passing: true
        });
      }
      formattedJSON.push({
        name: translate(period),
        start: scheduleJSON.gradeLevels.highSchool[scheduleType][period][0],
        end: scheduleJSON.gradeLevels.highSchool[scheduleType][period][1],
        passing: false
      });
      previousEnd = scheduleJSON.gradeLevels.highSchool[scheduleType][period][1];
    });
  }
  
  if (scheduleType != "NONE") {
    formattedJSON = [
      {
        name: translate("BEFORE_SCHOOL"),
        start: moment().startOf('day'),
        end: formattedJSON[0].start,
        passing: true
      },
      ...formattedJSON,
      {
        name: translate("AFTER_SCHOOL"),
        start: formattedJSON[formattedJSON.length - 1].end,
        end: moment().endOf('day'),
        passing: true
      }
    ]
  }
}

export function getTodaysGreeting() {
  return getGreeting() + " " + translateWithInsert("TODAY_IS", translate(scheduleType));
}

function translate(translateText) {
  return scheduleJSON.languages[storage.language][translateText];
}

function translateWithInsert(translateText, insertString) {
  var returnText = scheduleJSON.languages[storage.language][translateText];
  var index = returnText.indexOf("{}");
  return returnText.slice(0, index) + insertString + returnText.slice(index + 2);
}

function getGreeting() {
  var minutes = moment().minutes();
       if (minutes <= 720) { return translate("MORNING"); }
  else if (minutes <= 1050) { return translate("AFTERNOON"); }
  else if (minutes <= 1440) { return translate("EVENING"); }
  else { 
    console.log(minutes);
    console.log("Something went wrong. Please notify someone of this error including the number above.")
    return 'Hello, student'; 
    }
  }