/**
 * Date manipulation helpers.
 *
 * @author Steve Martin
 *
 * @flow
 */

import I18n from 'react-native-i18n';

import moment from 'moment';

const currentLocale = I18n.currentLocale();
const _now = new Date();

// Modified from
// https://stackoverflow.com/questions/27012854/change-iso-date-string-to-date-object-javascript
export function parseISODateString(s: string): Date {
  let b = s.split(/\D+/).map(d => parseInt(d, 10));
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

// Get a ISO 8601 datetime in UTC.
export function nowDateTime() : string {
  return _now.toISOString();
}

// Get a ISO 8601 datetime in UTC, but date only.
export function nowDate() : string {
  return _now.toISOString().split('T')[0];
}

// Get the current time.
export function nowDisplayTime() : string {
  moment.locale(currentLocale);
  return moment().format("HH:mm");
}

// Get a (TODO: localized) date string for today.
export function nowDateDisplay() : string {
  moment.locale(currentLocale);
  return moment().format("dddd, MMMM Do");
}

// Get a (TODO: localized) date string for a ISO 8601 datetime.
export function dateDisplay(date: string) : string {
  moment.locale(currentLocale);
  return moment(date).format("dddd, MMMM Do");
}

// Get localized (TODO!) weekday names.
export function getWeekdays() : Array<string> {
  moment.locale(currentLocale);
  return moment.weekdaysShort();
}

// Compare two dates in OSP 8601 string format, returning if a is before b.
export function isBefore(a: string, b: string): boolean {
  return moment(a).diff(moment(b)) < 0;
}

// Returns [ iso string ] for the date numbers between:
//   The start date (in ISO 8601).
//   The end date (in ISO 8601).
export function getDaysBetween(
  startDateString: string,
  endDateString: string) : Array<string> {
  const dates: Array<string> = [];
  const startDate = moment(startDateString).startOf('day');
  const endDate = moment(endDateString).startOf('day');

  while(startDate.add(1, 'days').diff(endDate) < 0) {
      dates.push(startDate.clone().format("YYYY-MM-DD"));
  }
  return dates;
}

// Returns [ [iso string, display string] ] for the date numbers between:
//   Date of Sunday before the start date (in ISO 8601).
//   Date of the Saturday after the end date (in ISO 8601).
export function getDaysBetweenDisplay(
  startDateString: string,
  endDateString: string) : Array<Array<string>> {
  const dates: Array<Array<string>> = [];
  const startDate = moment(startDateString).weekday(-8).startOf('day');
  const endDate = moment(endDateString).weekday(7).startOf('day');

  while(startDate.add(1, 'days').diff(endDate) < 0) {
      dates.push([
        startDate.clone().format("YYYY-MM-DD"),
        startDate.clone().format("MMM D"),
      ]);
  }
  return dates;
}

export function timeInMillis() {
  return moment().valueOf();
}
