import { settings } from "./settings.js";
export var scheduleJSON = JSON.parse(localStorage.getItem("scheduleJSON"));
export var eventsJSON = JSON.parse(localStorage.getItem("eventsJSON"));

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

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
      var serverEventsJSON = JSON.parse(this.responseText);
      if (eventsJSON == null || eventsJSON.version < serverEventsJSON.version) {
        localStorage.setItem("eventsJSON", JSON.stringify(serverEventsJSON));
        eventsJSON = serverEventsJSON;
      }
  }
};
xmlhttp.open("GET", "./events.json", true);
xmlhttp.send();


getSchedule(new Date());
export function getSchedule(date) {  
  //Check if an override exists
  if (Object.keys(scheduleJSON.overrides).includes(date)) { // this doesn't work - find a way to format the date for the JSON using the Date class
    scheduleType = scheduleJSON.overrides[date.getDate()];
  } else {
    scheduleType = scheduleJSON.defaults[date.getDay()];
  }

  var previousEnd;
  if (settings.grade >= 9) {
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
export function translate(translateText) {
  return scheduleJSON.languages[settings.language][translateText];
}

export function translateWithInsert(translateText, insertString) {
  var returnText = scheduleJSON.languages[settings.language][translateText];
  var index = returnText.indexOf("{}");
  return returnText.slice(0, index) + insertString + returnText.slice(index + 2);
}
