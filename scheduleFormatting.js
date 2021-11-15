import { settings } from "./settings.js";
export var scheduleJSON = JSON.parse(localStorage.getItem("scheduleJSON"));
export var languageJSON = JSON.parse(localStorage.getItem("languageJSON"));
export var eventsJSON = JSON.parse(localStorage.getItem("eventsJSON"));

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

fetch("./events.json")
  .then(response => response.json())
  .then(serverEventsJSON => {
    if (eventsJSON == null || eventsJSON.version < serverEventsJSON.version) {
        localStorage.setItem("eventsJSON", JSON.stringify(serverEventsJSON));
        eventsJSON = serverEventsJSON;
      }
  });

getSchedule(moment());

export var formattedJSON = getSchedule(moment());
export function getSchedule(date) {
  if (date == null) return;
  var scheduleType;
  var localJSON = [];

  //Check if an override exists
  if (Object.keys(scheduleJSON.overrides).includes(date.format("MM/DD/YYYY"))) {
    scheduleType = scheduleJSON.overrides[date.format("MM/DD/YYYY")];
  } else {
    
    scheduleType = scheduleJSON.defaults[date.format("e")];
    //console.log(scheduleType)
  }

  if (scheduleType != "NONE") {
    var previousEnd;
    if (settings.grade >= 9) {
      Object.keys(scheduleJSON.gradeLevels.highSchool[scheduleType]).forEach(period => {
        if (previousEnd != undefined) {
          localJSON.push({
            name: "PASSING_BEFORE," + period,
            start: previousEnd,
            end: scheduleJSON.gradeLevels.highSchool[scheduleType][period][0],
            passing: true
          });
        }
        localJSON.push({
          name: period,
          start: scheduleJSON.gradeLevels.highSchool[scheduleType][period][0],
          end: scheduleJSON.gradeLevels.highSchool[scheduleType][period][1],
          passing: false
        });
        previousEnd = scheduleJSON.gradeLevels.highSchool[scheduleType][period][1];
      });
    }

    localJSON = [
      {
        name: "BEFORE_SCHOOL",
        start: moment().startOf('day'),
        end: localJSON[0].start,
        passing: true
      },
      ...localJSON,
      {
        name: "AFTER_SCHOOL",
        start: localJSON[localJSON.length - 1].end,
        end: moment().endOf('day'),
        passing: true
      }
    ]
  } else {
    localJSON = [
      {
        name: "NO_SCHOOL",
        start: moment().startOf('day'),
        end: moment().endOf('day'),
        passing: false
      }
    ]
  }

  localJSON.scheduleType = scheduleType;

  return localJSON;
}
