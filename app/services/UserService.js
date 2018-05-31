/**
 * Data service for managing user state in GoalTender.
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

const keyPrefix = 'user:';
const defaultId = "local";

// TODO: Add auth support.
// TODO: Add off-device persistence via API.
export class UserService {
  static _date = new Date();

  static _makeUser(userId: string, lastUpdateDate?: string) {
    return new User(
      userId,
      (lastUpdateDate? lastUpdateDate : this._date.toISOString()));
  }

  // TODO: Handle calling out to an API, and using AsyncStorage as a local
  // cache.
  static async getUser(
    callback: (User) => void) {
    try {
      // TODO: Auth!  For now, just use the default.
      const userKey = keyPrefix + defaultId;
      return AsyncStorage.getItem(userKey)
        // For now, just return the fake data below.
        .then(val => callback(userObj));
        //.then(val => callback(val));
    } catch (error) {
      // Return a new local user.
      callback(this._makeUser(defaultId));
    }
  }

  // Update a user's login time, or create a new one locally.
  // Returns the user object.
  static async upsertUser(
    userId: string | null,
    callback: (User) => void) {
    try {
      const now = this._date.toISOString();
      const userIdChecked = (!userId ? defaultId : userId);
      const userData = this._makeUser(userIdChecked);
      const userKey = keyPrefix + userIdChecked;
      return AsyncStorage.setItem(userKey, userData)
        .then(callback(userData));
    } catch (error) {
      // Silently swallow.
    }
  }
}

// POJsO for a user.
export class User {
  getId: () => string;
  getLastUpdateDate: () => string;
  toJSON: () => Object;

  constructor(id: string, lastUpdateDate: string) {
    let _id = id;
    let _lastUpdateDate = lastUpdateDate;

    this.getId = function() {
      return _id;
    };

    this.getLastUpdateDate = function() {
      return _lastUpdateDate;
    }

    this.toJSON = function() {
      return {
        userId: _id,
        lastUpdateDate: _lastUpdateDate,
      };
    }
  }
}

//
// For now, temporary user structure for the API to parse and return.
//

const userObj = new User(
  "SomeIDString",
  "2018-05-31T11:45:12,780210000-00:00",
);

// Represents the list of user goals.
const user = {
  version: 1,
  userId: "SomeIDString", // Flattened from a user object elsewhere.
  lastUpdateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
};
