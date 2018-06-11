/**
 * Utility functions used across GoalTender.
 *
 * @author Steve Martin
 *
 * @flow
 */

const packageJSON = require('../../package.json');

// From https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
// Should have good enough entropy for this little app.
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Sanitize a string for output to CSV.
export function escapeString(input:?string): string {
  if (input == null) return '';
  return input
    .replace(/(\r\n|\n|\r|\s+|\t)/gm,' ')
    .replace(/,/g, '\,')
    .replace(/"/g, '"""')
    .replace(/'/g, '\'')
    .replace(/ +(?= )/g,'');
}

export function log(msg:string) {
  // $FlowFixMe
  if(__DEV__)
    console.log(msg);
}

export function getVersion() {
  return packageJSON.version;
}
