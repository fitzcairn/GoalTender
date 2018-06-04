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

 // POJsO for a goal State.
 export class State {
   getState: () => number;
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

// POJsO for a Goal state list.
export class StateList {
  getUserId: () => string;
  getGoalId: () => string;
  addState: (State) => StateList;
  addStates: (Array<State>) => StateList;
  getStates: () => Array<State>;
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

    this.addState = function(state: State) {
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
    let stateListObj = new StateList(jsonObj.userId, jsonObj.goalId);
    jsonObj.stateList.forEach((stateJson: string, i: number) => {
      jsonObj.stateList[i] = State.fromJSONString(stateJson);
    });
    return stateListObj.addStates(jsonObj.goalList);
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
