/**
 * Data object for user state in GoalTender.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { nowDateTime } from '../../Util.js';

// POJsO for a user.
export class User {
  getId: () => string;
  getLastUpdateDateTime: () => string;
  getHasSeenFTUX: () => boolean;
  setLastUpdateDateTimeToNow: () => User;
  setHasSeenFTUX: (hasSeenFTUX?: boolean) => User;
  toJSONString: () => string;

  constructor(id: string, lastUpdateDateTime: string, hasSeenFTUX?: string) {
    let _id = id;
    let _lastUpdateDateTime = lastUpdateDateTime;
    let _hasSeenFTUX = (
      typeof hasSeenFTUX != 'undefined'? (hasSeenFTUX == 'true') : false);

    Boolean(hasSeenFTUX).valueOf();

    this.getId = function() {
      return _id;
    };

    this.getHasSeenFTUX = function() {
      return _hasSeenFTUX;
    }

    this.getLastUpdateDateTime = function() {
      return _lastUpdateDateTime;
    }

    this.setLastUpdateDateTimeToNow = function() {
      _lastUpdateDateTime = nowDateTime();
      return this;
    }

    // Only update if arg defined.
    this.setHasSeenFTUX = function(hasSeenFTUX?: boolean) {
      if (typeof hasSeenFTUX != 'undefined')
        _hasSeenFTUX = hasSeenFTUX;
      return this;
    }

    this.toJSONString = function() {
      return JSON.stringify({
        userId: _id,
        lastUpdateDateTime: _lastUpdateDateTime,
        hasSeenFTUX: _hasSeenFTUX,
      });
    }
  }

  static fromJSONString(json: string) {
    let jsonObj = JSON.parse(json);
    return new User(jsonObj.userId,
      jsonObj.lastUpdateDateTime,
      jsonObj.hasSeenFTUX);
  }
}


//
// Test Data
//

const testData = {
  version: 1,
  userId: "SomeIDString", // Flattened from a user object elsewhere.
  lastUpdateDateTime: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
};
