/**
 * Data service for GoalTender Goal states.
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { generateId, parseISODateString, nowDate } from '../Util.js';


// States for a Goal
export const GoalStateValues = Object.freeze({
  NONE: 0,
  NO:   1,
  YES:  2,
});

// TODO: Add off-device persistence via API.
export class GoalStatesService {
  static _makeKey(userId: string, goalId: string) {
    return 'goalStateList:' + userId + ":" + goalId;
  }

  static _makeEmptyStateListFor(userId: string, goalId: string) {
    return new GoalStateList(userId, goalId);
  }

  // TODO: Remove.
  static _makeStateTestList() {
    let stateList = new GoalList(goalStateForId.userId);
    goalStateForId.stateList.forEach((g: Object) => {
     stateList.addState(new State(g.date, g.state));
    });
    return stateList;
  }

  // Get the state for a given goal day.
  static async getStatesFor(
    userId: string,
    goalId: string,
    callback: (GoalStateList) => void) {
      try {
        return AsyncStorage.getItem(this._makeKey(userId, goalId))
          .then((stateString) => {
            if (stateString == null)
              callback(this._makeEmptyStateListFor(userId, goalId));
            else
              callback(GoalStateList.fromJSONString(stateString));
          });
      } catch (error) {
        console.log(error);
        callback(this._makeEmptyStateListFor(userId, goalId));
      }
  }

  // Updated
  static addState(
    userId: string,
    goalId: string,
    callback: (GoalStateList) => void) {
      // TODO: This data schema won't work -- the majority use case is
      // viewing all the goals with today's state.  Re-do.
    }

}

// POJsO for a Goal state list.
export class GoalStateList {
  getUserId: () => string;
  getUserId: () => string;
  addState: (GoalState) => GoalStateList;
  addStates: (Array<GoalState>) => GoalStateList;
  getStates: () => Array<GoalState>;
  toJSONString: () => string;

  constructor(userId: string, goalId: string) {
    let _userId = userId;
    let _goalId = goalId;
    let _states = [];

    this.getUserId = function() {
      return _userId;
    };

    this.getGoalId = function() {
      return _goalId;
    };

    this.addState = function(state: GoalState) {
      _states.push(state);
      return this;
    }

    this.addStates = function(states: Array<Object>) {
      this._states = states;
      return this;
    }

    this.getStates = function() {
      return _states;
    }

    this.toJSONString = function() {
      return JSON.stringify({
        userId: _userId,
        goalId: _goalId,
        stateList: _states.map(state => { return state.toJSONString(); })
      });
    }
  }

  static fromJSONString(json: string) {
    let jsonObj = JSON.parse(json);
    let stateListObj = new GoalStateList(jsonObj.userId, jsonObj.goalId);
    jsonObj.goalList.forEach((goalJson: string, i: number) => {
      jsonObj.goalList[i] = Goal.fromJSONString(goalJson);
    });
    return goalListObj.addGoals(jsonObj.goalList);
  }
}

// POJsO for a Goal state.
export class GoalState {
  getState: () => number;
  getDate: () => string;
  toJSONString: () => string;

  constructor(state: number, date: string) {
    let _state = state;
    let _date = date;

    this.getId = function() {
      return _id;
    };

    this.getDate = function() {
      return _date;
    }

    this.toJSONString = function() {
      return JSON.stringify({
        date: _date,
        state: _state,
      });
    }
  }

  static fromJSONString(json: string) {
    let jsonObj = JSON.parse(json);
    return new Goal(GoalStateValues[jsonObj.state], jsonObj.date);
  }
}

//
// API Examples.
//

// GET goal/{id}
// TODO: Pagination?  This could get big.
const goalStateForId = {
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
