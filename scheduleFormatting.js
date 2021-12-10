// Import the user settings
import { settings } from "./settings.js";

// Export the JSON parsed in this file
export var scheduleJSON = JSON.parse(localStorage.getItem("scheduleJSON"));
export var languageJSON = JSON.parse(localStorage.getItem("languageJSON"));
export var eventsJSON = JSON.parse(localStorage.getItem("eventsJSON"));

// Fetch the schedule.json for updates
fetch("./schedule.json")
  .then((response) => response.json())
  .then((serverScheduleJSON) => {
    if (
      scheduleJSON == null ||
      scheduleJSON.version < serverScheduleJSON.version
    ) {
      localStorage.setItem("scheduleJSON", JSON.stringify(serverScheduleJSON));
      scheduleJSON = serverScheduleJSON;
      location.reload();
    }
  });

// Fetch the language.json for update
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
      location.reload();
    }
  });

// Fetch the events.json for updates
fetch("./events.json")
  .then((response) => response.json())
  .then((serverEventsJSON) => {
    if (eventsJSON == null || eventsJSON.version < serverEventsJSON.version) {
      localStorage.setItem("eventsJSON", JSON.stringify(serverEventsJSON));
      eventsJSON = serverEventsJSON;
    }
  });

// Create and export the formattedJSON for today
export var formattedJSON = getSchedule(moment());

// Function - get the formatted schedule json for a specific day - pass in a moment() object
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
    if (inRange(date, "SUMMER_BREAK")) {
      scheduleType = "SUMMER_BREAK";
    } else if(inRange(date, "WINTER_BREAK")) {
      scheduleType = "WINTER_BREAK";
    } else if(inRange(date, "SPRING_BREAK")) {
      scheduleType = "SPRING_BREAK";
    } else if(inRange(date, "FALL_BREAK")) {
      scheduleType = "FALL_BREAK";
    } else {
      scheduleType = scheduleJSON.defaults[date.format("e")];
    }
    if(inRange(date, "BLOCK_SWITCH")) {
      if (scheduleType == "BLOCK_EVEN") { scheduleType = "BLOCK_ODD"; }
      else if (scheduleType == "BLOCK_ODD") { scheduleType = "BLOCK_EVEN"; }
    }
  }

  // Add the periods and passing periods the json
  if (scheduleType != "NONE" && !scheduleType.includes("BREAK")) {
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
        start: moment().startOf("day"),
        end: localJSON[0].start,
        passing: true,
      },
      ...localJSON,
      {
        name: "AFTER_SCHOOL",
        start: localJSON[localJSON.length - 1].end,
        end: moment().endOf("day"),
        passing: true,
      },
    ];
  } else { // Add only no school
    localJSON = [
      {
        name: "NONE",
        start: moment().startOf("day"),
        end: moment().endOf("day"),
        passing: false,
      },
    ];
  }

  // Add the scheduleType to the json
  localJSON.scheduleType = scheduleType;
  return localJSON;
}

// Function - Check if a date is in a date from the schedule.json
function inRange(date, range) {
  return date.isBetween(moment(scheduleJSON.dateRanges[range][0], "MM/DD/YYYY").startOf('day'), moment(scheduleJSON.dateRanges[range][1], "MM/DD/YYYY").endOf('day'));
}
