import { userSettings } from "./settings.js";

// Export the JSON parsed in this file
export let scheduleJSON = JSON.parse(localStorage.getItem("scheduleJSON"));
export let languageJSON = JSON.parse(localStorage.getItem("languageJSON"));
export let eventsJSON = JSON.parse(localStorage.getItem("eventsJSON"));

let reload = false;
async function checkDataVersion(response, existingData) {
  const data = await response.json();
  if (existingData == null || existingData.version < data.version) return (reload = true), data;
  return Promise.reject();
}

Promise.allSettled([
  // Fetch the schedule.json for updates
  fetch("/data/schedule.json")
    .then((r) => checkDataVersion(r, scheduleJSON))
    .then((serverScheduleJSON) => {
      localStorage.setItem("scheduleJSON", JSON.stringify(serverScheduleJSON));
      scheduleJSON = serverScheduleJSON;
    }),

  // Fetch the language.json for update
  fetch("/data/languages.json")
    .then((r) => checkDataVersion(r, languageJSON))
    .then((serverLanguageJSON) => {
      const tempJSON = serverLanguageJSON[userSettings.LANGUAGE];
      tempJSON.version = serverLanguageJSON.version;
      tempJSON.language = userSettings.LANGUAGE;
      localStorage.setItem("languageJSON", JSON.stringify(tempJSON));
    }),

  // Fetch the events.json for updates
  fetch("/data/events.json")
    .then((r) => checkDataVersion(r, eventsJSON))
    .then((serverEventsJSON) => {
      localStorage.setItem("eventsJSON", JSON.stringify(serverEventsJSON));
      eventsJSON = serverEventsJSON;
    }),
]).then(() => {
  if (reload) location.reload();
});

// Create and export the formattedJSON for today
export const formattedJSON = getSchedule(dayjs());

// Set timezone for dayjs (not sure if it does anything)
dayjs.tz.setDefault(scheduleJSON.timezone);

/**
 * Get the formatted schedule json for a specific day
 * @param {dayjs()} date - The date to get the schedule for
 * @returns {JSON} - The formatted schedule json
 */
export function getSchedule(date) {
  if (date == null) return;
  var scheduleType;
  var localJSON = [];

  // Check if an override exists for the date
  if (Object.keys(scheduleJSON.overrides.all).includes(date.format("MM/DD/YYYY"))) {
    scheduleType = scheduleJSON.overrides.all[date.format("MM/DD/YYYY")];
  } else if (Object.keys(scheduleJSON.overrides[userSettings.GRADE_LEVEL]).includes(date.format("MM/DD/YYYY"))) {
    scheduleType = scheduleJSON.overrides[userSettings.GRADE_LEVEL][date.format("MM/DD/YYYY")];
  } else {
    // Check if today is in a range
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
  if (scheduleType != "NONE" && !Object.keys(scheduleJSON.dateRanges.breaks).includes(scheduleType)) {
    var previousEnd;
    switch (userSettings.GRADE_LEVEL) {
      case "GRADE_7":
      case "GRADE_8":
        Object.keys(scheduleJSON.gradeLevels.middleSchool[scheduleType]).forEach((period) => {
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
        });
        break;
      case "GRADE_9":
      case "GRADE_10":
      case "GRADE_11":
      case "GRADE_12":
        Object.keys(scheduleJSON.gradeLevels.highSchool[scheduleType]).forEach((period) => {
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
          previousEnd = scheduleJSON.gradeLevels.highSchool[scheduleType][period][1];
        });
        break;
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
  } else {
    // Add only no school
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
  for (const ranges in scheduleJSON.dateRanges.breaks) {
    for (const range of scheduleJSON.dateRanges.breaks[ranges]) {
      if (date.startOf().add(1, "hour").isBetween(dayjs(range[0], "MM/DD/YYYY").startOf("day"), dayjs(range[1], "MM/DD/YYYY").endOf("day"))) {
        breakType = ranges;
        break;
      }
    }
  }
  return breakType;
}

// Function - Check if a date is in a custom week from the schedule.json and get that week if so
function inCustomWeek(date) {
  var weekType = false;
  for (var range in scheduleJSON.dateRanges.customWeeks) {
    if (date.startOf().add(1, "hour").isBetween(dayjs(scheduleJSON.dateRanges.customWeeks[range][0], "MM/DD/YYYY").startOf("day"), dayjs(scheduleJSON.dateRanges.customWeeks[range][1], "MM/DD/YYYY").endOf("day"))) {
      weekType = range;
      break;
    }
  }
  return weekType;
}

export function getEvent(date) {
  if (date.year() in eventsJSON) {
    return eventsJSON[date.year()][dayjs.months()[date.month()]][date.date()];
  }
  return undefined;
}
