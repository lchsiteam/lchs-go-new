import { settings } from "./settings.js";
export var scheduleJSON = JSON.parse(localStorage.getItem("scheduleJSON"));
export var languageJSON = JSON.parse(localStorage.getItem("languageJSON"));

//Schedule JSON Request
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var serverScheduleJSON = JSON.parse(this.responseText);
    if (scheduleJSON == null || scheduleJSON.version < serverScheduleJSON.version) {
      localStorage.setItem("scheduleJSON", JSON.stringify(serverScheduleJSON));
      scheduleJSON = serverScheduleJSON;
      location.reload();
    }
  }
};
xmlhttp.open("GET", "./schedule.json", true);
xmlhttp.send();

//Language JSON Request
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var serverLanguageJSON = JSON.parse(this.responseText);
    if (languageJSON == null || languageJSON.language != settings.language || languageJSON.verion < serverLanguageJSON.verion) {
      var tempJSON = serverLanguageJSON[settings.language];
      tempJSON.language = settings.language;
      tempJSON.version = serverLanguageJSON.verion;
      localStorage.setItem("languageJSON", JSON.stringify(tempJSON))
      location.reload();
    }
  }
};
xmlhttp.open("GET", "./languages.json", true);
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

  var previousEnd;
  if (settings.grade >= 9) {
    Object.keys(scheduleJSON.gradeLevels.highSchool[scheduleType]).forEach(period => {
      if (previousEnd != undefined) {
        formattedJSON.push({
          name: "PASSING_BEFORE," + period,
          start: previousEnd,
          end: scheduleJSON.gradeLevels.highSchool[scheduleType][period][0],
          passing: true
        });
      }
      formattedJSON.push({
        name: period,
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
        name: "BEFORE_SCHOOL",
        start: moment().startOf('day'),
        end: formattedJSON[0].start,
        passing: true
      },
      ...formattedJSON,
      {
        name: "AFTER_SCHOOL",
        start: formattedJSON[formattedJSON.length - 1].end,
        end: moment().endOf('day'),
        passing: true
      }
    ]
  }
}
