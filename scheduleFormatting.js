import { settings } from "./settings.js";
export var scheduleJSON = JSON.parse(localStorage.getItem("scheduleJSON"));
export var languageJSON = JSON.parse(localStorage.getItem("languageJSON"));

fetch("./schedule.json")
  .then(response => response.json())
  .then((serverScheduleJSON) => {
    if (scheduleJSON == null || scheduleJSON.version < serverScheduleJSON.version) {
      localStorage.setItem("scheduleJSON", JSON.stringify(serverScheduleJSON));
      scheduleJSON = serverScheduleJSON;
      location.reload();
    }
  });

fetch("./languages.json")
  .then(response => response.json())
  .then(serverLanguageJSON => {
    if (languageJSON == null || languageJSON.language != settings.language || languageJSON.version < serverLanguageJSON.version) {  
      var tempJSON = serverLanguageJSON[settings.language];
      tempJSON.version = serverLanguageJSON.version;
      tempJSON.language = settings.language;
      localStorage.setItem("languageJSON", JSON.stringify(tempJSON))
      location.reload();
    }
  });

export var formattedJSON = [];
export var scheduleType;

getSchedule(moment());
export function getSchedule(date) {  
  //Check if an override exists
  if (Object.keys(scheduleJSON.overrides).map(d => moment(d, "MM/DD/YYYY")).includes(date.format("MM/DD/YYYY"))) {
    scheduleType = scheduleJSON.overrides[date.format("MM/DD/YYYY")];
  } else {
    scheduleType = scheduleJSON.defaults[date.format("e")];
  }

  if (scheduleType != "NONE") {
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
  } else {
    formattedJSON = [
      {
        name: "NO_SCHOOL",
        start: moment().startOf('day'),
        end: moment().endOf('day'),
        passing: false
      }
    ]
  }
}
