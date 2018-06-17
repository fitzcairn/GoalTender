/**
 * Data object for user state in GoalTender.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { nowDateTime } from '../../Dates.js';

// POJsO for a user.
export class User {
  getId: () => string;
  getLastUpdateDateTime: () => string;
  getHasSeenFTUX: () => boolean;
  getReminderTime: () => ?string;
  setReminderTime: (reminderTime?: ?string) => User;
  setLastUpdateDateTimeToNow: () => User;
  setHasSeenFTUX: (hasSeenFTUX?: boolean) => User;
  toJSONString: () => string;

  constructor(
    id: string,
    lastUpdateDateTime: string,
    hasSeenFTUX: boolean,
    reminderTime: ?string
  ) {

    let _id = id;
    let _lastUpdateDateTime = lastUpdateDateTime;
    let _hasSeenFTUX = hasSeenFTUX;
    let _reminderTime = reminderTime;

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

    this.getReminderTime = function() {
      return _reminderTime;
    }

    this.setReminderTime = function(reminderTime?: ?string) {
      if (typeof reminderTime != 'undefined')
        _reminderTime = reminderTime;
      return this;
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
        reminderTime: _reminderTime,
      });
    }
  }

  static fromJSONString(json: string) {
    let jsonObj = JSON.parse(json);
    return new User(jsonObj.userId,
      jsonObj.lastUpdateDateTime,
      jsonObj.hasSeenFTUX,
      jsonObj.reminderTime);
  }
}
