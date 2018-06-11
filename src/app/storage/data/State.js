/**
 * Data objects for goal States.
 *
 * @author Steve Martin
 *
 * @flow
 */

// States for a Goal
export const StateValues = Object.freeze({
 NONE: 0,
 NO:   1,
 YES:  2,
});

// Reverse lookup for states.
const StateValueNames = Object.freeze([
 "",       // 0
 "NO",     // 1
 "YES",    // 2
]);

// POJsO for a goal State.
export class State {
  getState: () => number;
  getStateString: () => string;
  getGoalId: () => string;
  getDate: () => string;
  toJSONString: () => string;

  constructor(state: number, goalId: string, date: string) {
    const _state = state;
    const _goalId = goalId;
    const _date = date;

    this.getState = function() {
      return _state;
    };

    this.getStateString = function() {
      const str:?string = StateValueNames[_state];
      if (str) return str;
      return "";
    }

    this.getGoalId = function() {
      return _goalId;
    };

    this.getDate = function() {
      return _date;
    }

    this.toJSONString = function() {
      return JSON.stringify({
        goalId: _goalId,
        date: _date,
        state: _state,
      });
    }
  }

  static fromJSONString(json: string) {
    let jsonObj = JSON.parse(json);
    return new State(jsonObj.state, jsonObj.goalId, jsonObj.date);
  }
}

// POJsO for a list of dates we have state for a goal.
export class StateDatesList {
  getUserId: () => string;
  getGoalId: () => string;
  addDate: (string) => StateDatesList;
  getDates: () => Array<string>;
  toJSONString: () => string;

  constructor(userId: string, goalId: string, dates?: Array<string>) {
    let _userId = userId;
    let _goalId = goalId;
    const _dateMap:Map<string, boolean> = new Map();
    if (typeof dates != 'undefined') dates.forEach((date: string) => {
      _dateMap.set(date, true);
    });

    this.getUserId = function() {
      return _userId;
    };

    this.getGoalId = function() {
      return _goalId;
    };

    this.addDate = function(date: string) {
      _dateMap.set(date, true);
      return this;
    }

    this.getDates = function() {
      return Array.from(_dateMap.keys());
    }

    this.toJSONString = function() {
      return JSON.stringify({
        userId: _userId,
        goalId: _goalId,
        dateList: this.getDates(),
      });
    }
  }

  static fromJSONString(json: string) {
    let jsonObj = JSON.parse(json);
    return new StateDatesList(jsonObj.userId, jsonObj.goalId, jsonObj.dateList);
  }
}


//
// Test Data
//

// TODO: Pagination?  This could get big.
const testData = {
  version: 1,
  userId: "SomeIDString", // Flattened from a user object elsewhere.
  goalId: "12",
  stateList: [ // Always in descending order of date.
    {
      date: "2018-06-02", // ISO 8601, UTC, but day only.
      state: "NO",
    },
    { // Note that days can be skipped for this goal.
      date: "2018-06-01", // ISO 8601, UTC, but day only.
      state: "YES",
    },
    {
      date: "2018-05-31", // ISO 8601, UTC, but day only.
      state: "YES",
    },
    {
      date: "2018-05-30", // ISO 8601, UTC, but day only.
      state: "NO",
    },
    { // Note that days can be skipped for this goal.
      date: "2018-05-27", // ISO 8601, UTC, but day only.
      state: "YES",
    },
  ],
};
