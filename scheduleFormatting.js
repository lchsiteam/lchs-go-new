// Import the user settings
import { settings } from "./settings.js";

// Export the JSON parsed in this file
export var scheduleJSON = JSON.parse(localStorage.getItem("scheduleJSON"));
export var languageJSON = JSON.parse(localStorage.getItem("languageJSON"));
export var eventsJSON = JSON.parse(localStorage.getItem("eventsJSON"));

dayjs.tz.setDefault("America/Los_Angeles")

var reload = false;
// Fetch the schedule.json for updates
var fetchSchedule = true;
fetch("./schedule.json")
  .then((response) => response.json())
  .then((serverScheduleJSON) => {
    if (
      scheduleJSON == null ||
      scheduleJSON.version < serverScheduleJSON.version
    ) {
      localStorage.setItem("scheduleJSON", JSON.stringify(serverScheduleJSON));
      scheduleJSON = serverScheduleJSON;
      reload = true;
    }
    fetchSchedule = false;
    refresh();
  });

// Fetch the language.json for update
var fetchLang = true;
fetch("./languages.json")
  .then((response) => response.json())
  .then((serverLanguageJSON) => {
    if (
      languageJSON == null ||
      languageJSON.language != settings.language ||
      languageJSON.version < serverLanguageJSON.version
    ) {
      var tempJSON = serverLanguageJSON[settings.language];
      tempJSON.version = serverLanguageJSON.version;
      tempJSON.language = settings.language;
      localStorage.setItem("languageJSON", JSON.stringify(tempJSON));
      reload = true;
    }
    fetchLang = false;
    refresh();
  });

// Fetch the events.json for updates
var fetchEvents = true;
fetch("./events.json")
  .then((response) => response.json())
  .then((serverEventsJSON) => {
    if (eventsJSON == null || eventsJSON.version < serverEventsJSON.version) {
      localStorage.setItem("eventsJSON", JSON.stringify(serverEventsJSON));
      eventsJSON = serverEventsJSON;
      reload = true;
    }
    fetchEvents = false;
    refresh();
  });

function refresh() {
  if (!fetchSchedule && !fetchLang && !fetchEvents) {
    if (reload) {
      location.reload();
    }
  }
}

// Create and export the formattedJSON for today
export var formattedJSON = getSchedule(dayjs());

// Function - get the formatted schedule json for a specific day - pass in a dayjs() object
export function getSchedule(date) {
  if (date == null) return;
  var scheduleType;
  var localJSON = [];

  // Check if an override exists
  if (Object.keys(scheduleJSON.overrides.all).includes(date.format("MM/DD/YYYY"))) {
    scheduleType = scheduleJSON.overrides.all[date.format("MM/DD/YYYY")];
  } else if (Object.keys(scheduleJSON.overrides[settings.grade]).includes(date.format("MM/DD/YYYY"))) {
    scheduleType = scheduleJSON.overrides[settings.grade][date.format("MM/DD/YYYY")];
  } else { // Check if today is in a range
    var isBreak = inBreak(date);
    var isCustomWeek = inCustomWeek(date);
    if (isBreak) {
      scheduleType = isBreak;
    } else if (isCustomWeek) {
      scheduleType = scheduleJSON.customWeeks[isCustomWeek][date.day()];
    } else {
      scheduleType = scheduleJSON.defaults[date.day()];
    }
  }

  // Add the periods and passing periods the json
  if (scheduleType != "NONE" && !scheduleJSON.breaks.includes(scheduleType)) {
    var previousEnd;
    switch (settings.grade) {
      case "GRADE_7":
      case "GRADE_8":
        Object.keys(scheduleJSON.gradeLevels.middleSchool[scheduleType]).forEach(
          (period) => {
            if (previousEnd != undefined) {
              localJSON.push({
                name: "PASSING_BEFORE," + period,
                start: previousEnd,
                end: scheduleJSON.gradeLevels.middleSchool[scheduleType][period][0],
                passing: true,
              });
            }
            localJSON.push({
              name: period,
              start: scheduleJSON.gradeLevels.middleSchool[scheduleType][period][0],
              end: scheduleJSON.gradeLevels.middleSchool[scheduleType][period][1],
              passing: false,
            });
            previousEnd = scheduleJSON.gradeLevels.middleSchool[scheduleType][period][1];
          }
        );
      break;
      case "GRADE_9":
      case "GRADE_10":
      case "GRADE_11":
      case "GRADE_12":
        Object.keys(scheduleJSON.gradeLevels.highSchool[scheduleType]).forEach(
          (period) => {
            if (previousEnd != undefined) {
              localJSON.push({
                name: "PASSING_BEFORE," + period,
                start: previousEnd,
                end: scheduleJSON.gradeLevels.highSchool[scheduleType][period][0],
                passing: true,
              });
            }
            localJSON.push({
              name: period,
              start: scheduleJSON.gradeLevels.highSchool[scheduleType][period][0],
              end: scheduleJSON.gradeLevels.highSchool[scheduleType][period][1],
              passing: false,
            });
            previousEnd =
              scheduleJSON.gradeLevels.highSchool[scheduleType][period][1];
          }
        );
      break;
    }
    if (settings.grade >= 9) {
      
    }

    // Add before and after school
    localJSON = [
      {
        name: "BEFORE_SCHOOL",
        start: dayjs().startOf("day"),
        end: localJSON[0].start,
        passing: true,
      },
      ...localJSON,
      {
        name: "AFTER_SCHOOL",
        start: localJSON[localJSON.length - 1].end,
        end: dayjs().endOf("day"),
        passing: true,
      },
    ];
  } else { // Add only no school
    localJSON = [
      {
        name: "NONE",
        start: dayjs().startOf("day"),
        end: dayjs().endOf("day"),
        passing: false,
      },
    ];
  }

  // Add the scheduleType to the json
  localJSON.scheduleType = scheduleType;
  return localJSON;
}

// Function - Check if a date is in a break from the schedule.json and get that break if so
function inBreak(date) {
  var breakType = false;
  for (var range in scheduleJSON.dateRanges.breaks) {
    if (date.startOf().add(1, 'hour').isBetween(dayjs(scheduleJSON.dateRanges.breaks[range][0], "MM/DD/YYYY").startOf('day'), dayjs(scheduleJSON.dateRanges.breaks[range][1], "MM/DD/YYYY").endOf('day'))) {
      breakType = range;
      break;
    }
  }
  return breakType;
}

// Function - Check if a date is in a custom week from the schedule.json and get that week if so
function inCustomWeek(date) {
  var weekType = false;
  for (var range in scheduleJSON.dateRanges.customWeeks) {
    if (date.startOf().add(1, 'hour').isBetween(dayjs(scheduleJSON.dateRanges.customWeeks[range][0], "MM/DD/YYYY").startOf('day'), dayjs(scheduleJSON.dateRanges.customWeeks[range][1], "MM/DD/YYYY").endOf('day'))) {
      weekType = range;
      break;
    }
  }
  return weekType;
}

export function getEvent(date) {
  if (date.year() in eventsJSON){
    return eventsJSON[date.year()][dayjs.months()[date.month()]][date.date()]
  }
  return undefined
}
