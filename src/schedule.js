import { settings, userSettings } from "./settings.js";

/**
 * @typedef GradeLevel
 * @property {[PeriodName: timeString[]]} ScheduleType - The grade levels for each schedule type
 *
 * Schedule JSON
 * @typedef {Object} ScheduleJSON
 * @property {number} version - The version of the schedule.json
 * @property {string} timezone - The timezone of the host
 * @property {string} timeOffeset - The time offset
 * @property {[number: ScheduleType]} defaults - The default schedule for each day of the week
 * @property {Object} overrides - The overrides for each day of the week
 * @property {[dateString: scheduleNameString]} overrides.all - The overrides for all grade levels
 * @property {[dateString: scheduleNameString]} overrides.GRADE_7 - The overrides for grade 7
 * @property {[dateString: scheduleNameString]} overrides.GRADE_8 - The overrides for grade 8
 * @property {[dateString: scheduleNameString]} overrides.GRADE_9 - The overrides for grade 9
 * @property {[dateString: scheduleNameString]} overrides.GRADE_10 - The overrides for grade 10
 * @property {[dateString: scheduleNameString]} overrides.GRADE_11 - The overrides for grade 11
 * @property {[dateString: scheduleNameString]} overrides.GRADE_12 - The overrides for grade 12
 * @property {Object} dateRanges - The date ranges for breaks and custom weeks
 * @property {[ScheduleType: dateString[][]]} dateRanges.breaks - The date ranges for breaks
 * @property {[CustomWeek: ScheduleType]} dateRanges.customWeeks - The date ranges for custom weeks
 * @property {[CustomWeek: [number: ScheduleType]]} customWeeks - The custom weeks for each custom week
 * @property {Object} gradeLevels - The grade levels for each schedule type
 */
/** @type {ScheduleJSON} */
export let scheduleJSON = {};
export let languageJSON = {};
export let eventsJSON = {};
let reload = false;
try {
  scheduleJSON = JSON.parse(localStorage.getItem("scheduleJSON"));
} catch (e) {
  console.error("There was an error parsing the schedule JSON. Please reset your Local Storage.");
  localStorage.removeItem("scheduleJSON");
  reload = true;
}
try {
  languageJSON = JSON.parse(localStorage.getItem("languageJSON"));
} catch (e) {
  console.error("There was an error parsing the language JSON. Please reset your Local Storage.");
  localStorage.removeItem("languageJSON");
  reload = true;
}
try {
  eventsJSON = JSON.parse(localStorage.getItem("eventsJSON"));
} catch (e) {
  console.error("There was an error parsing the events JSON. Please reset your Local Storage.");
  localStorage.removeItem("eventsJSON");
  reload = true;
}

async function checkDataVersion(response, existingData) {
  const data = await response.json();
  if (existingData == null || existingData.version < data.version || (existingData.language && userSettings.LANGUAGE != existingData.language)) return (reload = true), data;
  return Promise.reject(); // Reject if the data is up to date
}

Promise.allSettled([
  // Fetch the schedule.json for updates
  fetch("/data/schedule.json")
    .then((r) => checkDataVersion(r, scheduleJSON))
    .then(
      (serverScheduleJSON) => {
        localStorage.setItem("scheduleJSON", JSON.stringify(serverScheduleJSON));
        scheduleJSON = serverScheduleJSON;
      },
      () => {}
    )
    .catch(() => console.error("There was an error updating the schedule JSON. Please reset your Local Storage.")),

  // Fetch the language.json for update
  fetch("/data/languages.json")
    .then((r) => checkDataVersion(r, languageJSON))
    .then(
      (serverLanguageJSON) => {
        const englishKeys = Object.keys(serverLanguageJSON.ENGLISH);
        for (let lang of settings.LANGUAGE.options) {
          if (lang == "DEVELOPER") continue;
          if (Object.keys(serverLanguageJSON[lang]).length != englishKeys.length) {
            console.warn("\n\nLanguage JSON for " + lang + " is missing keys.\n\n");
            for (let key of englishKeys) {
              if (!serverLanguageJSON[lang][key]) console.warn("Missing key: " + key);
            }
          }
        }

        const tempJSON = serverLanguageJSON[userSettings.LANGUAGE];
        tempJSON.version = serverLanguageJSON.version;
        tempJSON.language = userSettings.LANGUAGE;
        localStorage.setItem("languageJSON", JSON.stringify(tempJSON));
        languageJSON = tempJSON;
      },
      () => {}
    )
    .catch(() => console.error("There was an error updating the language JSON. Please reset your Local Storage.")),

  // Fetch the events.json for updates
  fetch("/data/events.json")
    .then((r) => checkDataVersion(r, eventsJSON))
    .then(
      (serverEventsJSON) => {
        localStorage.setItem("eventsJSON", JSON.stringify(serverEventsJSON));
        eventsJSON = serverEventsJSON;
      },
      () => {}
    )
    .catch(() => console.error("There was an error updating the events JSON. Please reset your Local Storage.")),
]).then(() => {
  if (reload) location.reload();
});

/**
 * Period JSON
 * @typedef {Object} Period
 * @property {string} name - The name of the period
 * @property {dayjs} start - The start time of the period
 * @property {dayjs} end - The end time of the period
 * @property {boolean} passing - If the period is a passing period
 */
/**
 * Schedule JSON
 * @typedef {Object} Schedule
 * @property {dayjs} date - The date of the schedule
 * @property {string} scheduleType - The type of schedule for the day
 * @property {string} override - The override for the day
 * @property {Array<Period>} periods - The periods for the day
 */

/**
 * Get the formatted schedule json for a specific day
 * @param {dayjs} date - The date to get the schedule for
 * @returns {Schedule} - The formatted schedule json
 */
export function getSchedule(date) {
  const schedule = {
    date: date,
    scheduleType: "",
    override: "",
    periods: [],
  };
  if (date == null) schedule;
  const scheduleTypes = getScheduleTypes(date);
  schedule.scheduleType = scheduleTypes.scheduleOverride || scheduleTypes.scheduleDefault;
  schedule.override = scheduleTypes.scheduleOverride ? scheduleTypes.scheduleDefault : null;

  const periodList = getPeriods(schedule.scheduleType);
  const periods = getPeriodsJSON(periodList);
  schedule.periods = periods;

  return schedule;
}

/**
 * Get the periods for a specific schedule type
 * @param {string} scheduleType - The string of schedule type to get the periods for.
 * @returns {Object.<string, timeString[]>[] | "NONE"} - The periods for the schedule type
 */
function getPeriods(scheduleType) {
  if (scheduleType == null || scheduleType == "NONE") return "NONE";
  const periods = scheduleJSON.gradeLevels[userSettings.GRADE_LEVEL][scheduleType];
  const inheritsFrom = scheduleJSON.gradeLevels[userSettings.GRADE_LEVEL].inheritsFrom;
  let inheritedPeriods;
  if (inheritsFrom) inheritedPeriods = scheduleJSON.gradeLevels[inheritsFrom][scheduleType];
  return periods || inheritedPeriods || "NONE";
}

/**
 *
 * @param {Object.<string, timeString[]>[] | "NONE"} periodList - The periods to get the periods json for
 * @returns {Period[]} - The formatted periods json including passing periods
 */
function getPeriodsJSON(periodList) {
  if (periodList == "NONE")
    return [
      {
        name: "NONE",
        start: dayjs().startOf("day"),
        end: dayjs().endOf("day"),
        passing: false,
      },
    ];

  const periods = [];
  let previousEnd = undefined;
  for (const period in periodList) {
    if (previousEnd) {
      periods.push({
        name: "PASSING_BEFORE," + period,
        start: previousEnd,
        end: dayjs(periodList[period][0], "HH:mm A"),
        passing: true,
      });
    }
    periods.push({
      name: period,
      start: dayjs(periodList[period][0], "HH:mm A"),
      end: dayjs(periodList[period][1], "HH:mm A"),
      passing: false,
    });

    previousEnd = dayjs(periodList[period][1], "HH:mm A");
  }

  return [
    {
      name: "BEFORE_SCHOOL",
      start: dayjs().startOf("day"),
      end: periods[0].start,
      passing: true,
    },
    ...periods,
    {
      name: "AFTER_SCHOOL",
      start: periods[periods.length - 1].end,
      end: dayjs().endOf("day"),
      passing: true,
    },
  ];
}

/**
 * Get the schedule default and override types for a specific date
 * @param {dayjs} date - The date to get the schedule type for
 * @returns {{scheduleDefault: string, scheduleOverride: string}} - The schedule types for the date
 */
function getScheduleTypes(date) {
  // Check if the date is in a break range
  const breakType = inBreak(date);
  if (breakType) return { scheduleOverride: breakType };

  // Check if the date is in a custom week range and get the schedule type for that day
  const week = inCustomWeek(date);
  if (week) return { scheduleOverride: scheduleJSON.customWeeks[week][date.day()] };

  const scheduleOverride = (() => {
    const dateKey = date.format("MM/DD/YYYY");
    if (Object.keys(scheduleJSON.overrides[userSettings.GRADE_LEVEL]).includes(dateKey)) return scheduleJSON.overrides[userSettings.GRADE_LEVEL][dateKey];
    if (Object.keys(scheduleJSON.overrides.all).includes(dateKey)) return scheduleJSON.overrides.all[dateKey];
    return undefined;
  })();

  const scheduleDefault = scheduleJSON.defaults[date.day()];

  return { scheduleOverride, scheduleDefault };
}

/**
 * Gets the schedule type for a specific date without specifying the override
 * @param {dayjs} date - The date to get the schedule type for
 * @returns {string} - The schedule type for the date
 */
export function getScheduleType(date) {
  const scheduleTypes = getScheduleTypes(date);
  return scheduleTypes.scheduleOverride || scheduleTypes.scheduleDefault;
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
  const year = eventsJSON[date.year()];
  return year ? year[dayjs.months()[date.month()]][date.date()] : undefined;
}
