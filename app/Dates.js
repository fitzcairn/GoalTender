/**
 * Date manipulation helpers.
 *
 * @author Steve Martin
 *
 * @flow
 */

import moment from 'moment';

const _now = new Date();

// Modified from
// https://stackoverflow.com/questions/27012854/change-iso-date-string-to-date-object-javascript
export function parseISODateString(s: string) {
  let b = s.split(/\D+/).map(d => parseInt(d, 10));
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

// Get a ISO 8601 datetime in UTC.
export function nowDateTime() {
  return _now.toISOString();
}

// Get a ISO 8601 datetime in UTC, but date only.
export function nowDate() {
  return _now.toISOString().split('T')[0];
}

// Get a (TODO: localized) date string for today.
export function nowDateDisplay() {
  moment.locale('en');
  return moment().format("dddd, MMMM Do");
}

// Get localized (TODO!) weekday names.
export function getWeekdays() {
  moment.locale('en');
  return moment.weekdaysShort();
}

// Returns an array of the date numbers between:
//   Date of Sunday before the start date (in ISO 8601).
//   Date of the Saturday after the end date (in ISO 8601).
export function getDaysBetween(startDateString: string, endDateString: string) {
  const dates: Array<string> = [];
  const startDate = moment(startDateString).weekday(-8).startOf('day');
  const endDate = moment(endDateString).weekday(7).startOf('day');

  while(startDate.add(1, 'days').diff(endDate) < 0) {
      dates.push(startDate.clone().format("MMM D"));
  }
  return dates;
}
