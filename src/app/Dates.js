/**
 * Date manipulation helpers.
 *
 * @author Steve Martin
 *
 * @flow
 */

import I18n from 'react-native-i18n';

import moment from 'moment';

const _locale = I18n.currentLocale();

// This is a horrible, horrible hack to get around:
// https://github.com/moment/moment/issues/3624#issuecomment-335190847
const currentLocale =
  (_locale.indexOf("-") === -1 ?
  _locale :
  _locale.substr(0, _locale.indexOf('-')));

const _now = new Date();

// Parse an ISO 8601 string into a Date object.
export function parseISODateString(isoDateTime: string): Date {
  return moment(isoDateTime).toDate();
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

// Turn an ISO 8601 datetime string into a localized time display string.
export function fromIsoToDisplay(isoString: ?string): string {
  moment.locale(currentLocale);
  if (isoString != null)
    return moment(isoString).format("LT");
  return moment().format("LT");
}

// Get [hours, minutes] from an ISO 8601 string.
export function getHoursMinutes(isoString: string): Array<string> {
  moment.locale(currentLocale);
  return [moment(isoString).hours(), moment(isoString).minutes()];
}

// Get this exact time a day from now, in ISO 8601
export function getNextTime(isoTime: string): string {
  if (moment(isoTime).diff(moment()) < 0)
    return moment(isoTime).add(1, 'day').toISOString();
  return moment(isoTime).toISOString();
}
