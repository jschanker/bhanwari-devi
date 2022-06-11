import { format as dateFnsFormat, intervalToDuration } from "date-fns";
import { zonedTimeToUtc, formatInTimeZone as ftz } from "date-fns-tz";

/**
 * Returns a copy of the given date if supplied a Date object input or a Date
 *    object from the given timestamp.
 * @param {Date|string} date A valid Date string recognized by formatInTimeZone
 *     (https://www.npmjs.com/package/date-fns-tz#formatintimezone)
 *     or Date to be formatted
 * @return {Date} a copy of the inputted date or a new one from the timestamp
 */
const makeDateFrom = (date) => {
  return typeof date === 'string' ?
      new Date(zonedTimeToUtc(date).toISOString()) :
      date;
};

/**
 * Returns the time left until the given date or a warning or expiration if the
 *     date is within a specified amount of time at or before now
 * @param {Date|string} date A valid Date string recognized by formatInTimeZone
 *     (https://www.npmjs.com/package/date-fns-tz#formatintimezone)
 *     or Date to be formatted to determine the time remaining
 * @param {{expiredText: (string|undefined),
 *     precision: (Array<number>|undefined),
 *     cutoffTextArr: (string|undefined),
 *     cutoffNumArr: (Array<number>|undefined)}=} options The options for the
 *     string formatting.  expiredText is what's shown if the Date is now or past.
 *     precision[i] is the desired number of places to show when the ith item
 *     in [years, months, days, hours, minutes, seconds] is the largest
 *     non-zero unit in the time remaining (e.g., if precision[2] = 3), then
 *     when the time remaining starts with days, days, minutes, and hours will
 *     be displayed.  cutoffTextArr[i] is what's shown if the largest nonzero unit
 *     is at most cutoffNumArr[i].
 * @return {string} the time remaining or warning or expiration text
 */
export const timeLeftFormat = (
  date,
  {
    expiredText = "expired",
    precision = [6, 5, 4, 3, 2, 1],
    cutoffTextArr = [
      "warning",
      "warning",
      "warning",
      "warning",
      "warning",
      "warning",
    ],
    cutoffNumArr = [0, 0, 0, 0, 0, 0],
  } = {
    expiredText: "expired",
    precision: [6, 5, 4, 3, 2, 1],
    cutoffTextArr: [
      "warning",
      "warning",
      "warning",
      "warning",
      "warning",
      "warning",
    ],
    cutoffNumArr: [0, 0, 0, 0, 0, 0],
  }
) => {
  const targetDate = makeDateFrom(date);
  const now = makeDateFrom(new Date());

  if (targetDate <= now) {
    return expiredText;
  }

  const timeRemaining = intervalToDuration({
    start: now,
    end: targetDate,
  });
  const { years, months, days, hours, minutes, seconds } = timeRemaining;
  const units = [years, months, days, hours, minutes, seconds];
  const abbreviations = ["yr", "mo", "day", "hr", "min", "sec"];
  const indexOfLeadingUnit = units.findIndex((num) => num > 0);

  if (units[indexOfLeadingUnit] <= cutoffNumArr[indexOfLeadingUnit]) {
    return cutoffTextArr[indexOfLeadingUnit];
  } else {
    return units
      .slice(
        indexOfLeadingUnit,
        indexOfLeadingUnit + precision[indexOfLeadingUnit]
      )
      .map(
        (num, index) =>
          `${num} ${abbreviations[index + indexOfLeadingUnit]}${
            num !== 1 ? "s" : ""
          }`
      )
      .join(" ");
  }
};

/**
 * Provides the local date and time strings of the provided date in Meraki's
 *     standardized format (currently HH : mm and dd MMM, yyyy)
 * @param {Date|string} date A valid Date string recognized by formatInTimeZone
 *     (https://www.npmjs.com/package/date-fns-tz#formatintimezone)
 *     or Date to be formatted
 * @param {string} the string of tokens
 * @param {Object|undefined} an object with options
 * @return {{finalTime: string, finalDate: string}} the formatted date/time
 *     strings or empty strings if the input is null or undefined
 */
export const dateTimeFormat = (date) => {
  if (date == null) {
    return { finalTime: "", finalDate: "" };
  }

  return {
    finalTime: format(date, "HH : mm"),
    finalDate: format(date, "dd MMM, yyyy"),
  };
};

/**
 * Returns a timestamp of the given date in the required back-end format
 * @param {Date|string} date A valid Date string recognized by formatInTimeZone
 *     (https://www.npmjs.com/package/date-fns-tz#formatintimezone)
 *     or Date to be formatted
 * @return {string} the serialized date (currently YYYY-MM-DDTHH:mm:ss.sssZ)
 *     See: https://tc39.es/ecma262/#sec-date-time-string-format
 */
const serializeForBackEnd = (date) => {
  return makeDateFrom(date).toISOString();
}

const formatInTimeZone = (date, timeZone, formatStr) => {
  return ftz(makeDateFrom(date), timeZone, formatStr);
}

const formatInUtc = (date, formatStr) => {
  return formatInTimeZone(makeDate, "UTC", formatStr);
};

/**
 * Wrapper for the date-fns format function but allows date strings
 *     (See: https://date-fns.org/v2.16.1/docs/format#arguments)
 * @param {Date|string} date A valid Date string recognized by formatInTimeZone
 *     (https://www.npmjs.com/package/date-fns-tz#formatintimezone)
 *     or Date to be formatted
 * @param {string} formatStr the string of tokens
 * @param {Object|undefined} options an object with options
 * @return {string} the formatted date string in the user's local time zone
 */
export const format = (date, formatStr, options) => {
  const dateToFormat = makeDateFrom(date);
  return dateFnsFormat(dateToFormat, formatStr, options);
};

// module.exports = { timeLeftFormat, format };
