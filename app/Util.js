/**
 * Utility functions used across GoalTender.
 *
 * @author Steve Martin
 *
 * @flow
 */


const _now = new Date();

// From https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
// Should have good enough entropy for this little app.
export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
