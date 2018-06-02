/**
 * Data service for managing user state in GoalTender.
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { nowDateTime } from '../Util.js';

const keyPrefix = 'user:';
const defaultId = "local";

// TODO: Add auth support.
// TODO: Add off-device persistence via API.
export class UserService {

  static _makeUser(userId: string, lastUpdateDateTime?: string) {
    return new User(
      userId,
      (lastUpdateDateTime? lastUpdateDateTime : nowDateTime()));
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
        .then(userJSON => {
          if (userJSON == null)
            callback(this._makeUser(defaultId));
          else
            callback(User.fromJSONString(userJSON));
        });
    } catch (error) {
      console.log("Error fetching user: " + error);
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
      const now = this._today.toISOString();
      const userIdChecked = (!userId ? defaultId : userId);
      const userData = this._makeUser(userIdChecked);
      const userKey = keyPrefix + userIdChecked;
      return AsyncStorage.setItem(userKey, userData.toJSONString())
        .then(callback(userData));
    } catch (error) {
      console.log(error);
    }
  }
}

// POJsO for a user.
export class User {
  getId: () => string;
  getLastUpdateDate: () => string;
  toJSONString: () => string;

  constructor(id: string, lastUpdateDateTime: string) {
    let _id = id;
    let _lastUpdateDateTime = lastUpdateDateTime;

    this.getId = function() {
      return _id;
    };

    this.getLastUpdateDate = function() {
      return _lastUpdateDateTime;
    }

    this.toJSONString = function() {
      return JSON.stringify({
        userId: _id,
        lastUpdateDateTime: _lastUpdateDateTime,
      });
    }
  }

  static fromJSONString(json: string) {
    console.log(json);
    let jsonObj = JSON.parse(json);
    return new User(jsonObj.userId, jsonObj.lastUpdateDateTime);
  }
}

//
// API refrence.
//

// Represents the list of user goals.
const user = {
  version: 1,
  userId: "SomeIDString", // Flattened from a user object elsewhere.
  lastUpdateDateTime: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
};
