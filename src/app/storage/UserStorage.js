/**
 * Manages storages for User data.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { nowDateTime } from '../Dates.js';
import { User } from './data/User.js';


// TODO: Add auth support.
// TODO: Add off-device persistence via API.
export default class UserStorage {
  static _defaultId = "local";

  static _getUserId(userId?: string | null) {
    return (typeof userId == 'undefined' || userId == null ? this._defaultId : userId);
  }

  static _makeKey(userId?: string|null) {
    return 'user:' + this._getUserId(userId);
  }

  static _makeUser(userId: string) {
    return new User(userId, nowDateTime(), false);
  }

  /* Get a user object.

     REST equivalent:
       GET users/{id}

     Returns:
       {
         userId: "SomeIDString",
         lastUpdateDateTime: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601
       }
  */
  static async getUser(
    userId: string | null,
    callback: (User) => void
  ) {
    // TODO: make key with 3P login.
    return AsyncStorage.getItem(this._makeKey(userId))
      .then(userJSON => {
        if (userJSON == null)
          callback(this._makeUser(userId));
        else
          callback(User.fromJSONString(userJSON));
      });  // Don't swallow any exceptions with a catch block; prop to caller.
  }

  /* Update a user's login time, or create a new one.  Hands back an updated
     User.

     REST equivalent:
       PUT users/{id}

     Returns:
       {
         userId: "SomeIDString",
         lastUpdateDateTime: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601
       }
  */
  static async upsertUser(
    userId: string | null,
    callback: (User) => void,
    userData?: {
      hasSeenFTUX?: boolean,
      reminderTime?: string,
    }) {
    if (userData == null) userData = {};

    const newUser = this._makeUser(this._getUserId(userId))
      .setHasSeenFTUX(userData.hasSeenFTUX)
      .setReminderTime(userData.reminderTime);

    if (userId == null) { // New user case.
      return AsyncStorage.setItem(
        this._makeKey(newUser.getId()), newUser.toJSONString()
      ).then(callback(newUser));
    }
    else { // We should have this user.  Get and update them.
      return this.getUser(userId, (userObj) => {
        AsyncStorage.setItem(
          this._makeKey(userObj.getId()),
          userObj
            .setHasSeenFTUX(userData.hasSeenFTUX)
            .setReminderTime(userData.reminderTime)
            .setLastUpdateDateTimeToNow()
            .toJSONString()
          ).then(callback(userObj));
      }) // Don't swallow any exceptions with a catch block; prop to caller.
    }
  }
}
