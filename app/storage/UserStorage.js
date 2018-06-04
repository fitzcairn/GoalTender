/**
 * Manages storages for User data.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { nowDateTime } from '../Util.js';
import { User } from './data/User.js';


// TODO: Add auth support.
// TODO: Add off-device persistence via API.
export default class UserStorage {
  static _defaultId = "local";

  static _getUserId(userId?: string | null) {
    return (typeof userId == 'undefined' || userId == null ? this._defaultId : userId);
  }

  static _makeKey(userId?: string) {
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
    callback: (User) => void) {
      try {
        // TODO: make key with 3P login.
        return AsyncStorage.getItem(this._makeKey())
          .then(userJSON => {
            if (userJSON == null)
              callback(this._makeUser(this._defaultId));
            else
              callback(User.fromJSONString(userJSON));
          });
      } catch (error) {
        callback(this._makeUser(this._defaultId));
      }
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
    hasSeenFTUX?: boolean) {
      const newUser = this._makeUser(this._getUserId(userId))
        .setHasSeenFTUX(hasSeenFTUX);
      try {
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
                .setHasSeenFTUX(hasSeenFTUX)
                .setLastUpdateDateTimeToNow()
                .toJSONString()
              ).then(callback(userObj));
          }).catch((error) => {
            console.log(error);
            callback(newUser);
          });
        }
      } catch (error) {
        console.log(error);
        callback(newUser);
      }
  }
}
