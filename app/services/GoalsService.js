/**
 * Data service for GoalTender Goals.
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { generateId, parseISODateString, nowDate } from '../Util.js';

// TODO: Add off-device persistence via API.
export class GoalsService {

  static _makeKey(userId: string) {
    return 'goalList:' + userId;
  }

  static _makeEmptyGoalList(userId: string) {
    return new GoalList(userId);
  }

  // TODO: Remove.
  static _makeGoalTestList() {
    let goalList = new GoalList(goals.userId);
    goals.goalList.forEach((g: Object) => {
     goalList.addGoal(new Goal(g.goalId, g.goalText, nowDate()));
    });
    return goalList;
  }

  // Get the list of goals for this user.
  static async getGoals(
    userId: string,
    callback: (GoalList) => void) {
      try {
        return AsyncStorage.getItem(this._makeKey(userId))
          .then((goalString) => {
            if (goalString == null)
              callback(this._makeEmptyGoalList(userId));
            else
              callback(GoalList.fromJSONString(goalString));
          });
      } catch (error) {
        console.log(error);
        callback(this._makeEmptyGoalList(userId));
      }
  }

  // Simple add goal, callback executed with the new Goal.
  static addGoal(
    userId: string,
    goalText: string,
    callback: (Goal) => void) {
      let goal = new Goal(generateId(), goalText, nowDate());

      try {
        // TODO: this is pretty gnarly, this whole service probably needs rewriting.
        this.getGoals(
          userId,
          (goals: GoalList) => {
            // Have a list, now add and save back.
            goals.addGoal(goal);
            AsyncStorage.setItem(
              this._makeKey(userId), goals.toJSONString())
              .then(() => callback(goal))
              .catch((error) => {
                console.log(error);
              });
          }
        );
      } catch (error) {
        // TODO: Let's handle this better.
        console.log("Error saving new goal!");
        console.log(error);

        // Hand back the new goal.
        callback(goal);
      }
  }

  // Simple remove goal.
  // Callback executed with the updated GoalList.
  static async deleteGoal(
    goalId: string,
    goals: GoalList,
    callback: (GoalList) => void,
    index?: number) {
      try {
       // Remove the goal from the in-memory list.
       const goalList = goals.getGoals();
       if( typeof index !== 'undefined' ) {
         goalList.splice(index, 1);
       }
       else {
         for (let i = 0; i < goalList.length; i++) {
           if (goalList[i].getId() == goalId) {
             goalList.splice(i, 1);
           }
         }
       }

       return AsyncStorage.setItem(
         this._makeKey(goals.getUserId()), goals.toJSONString())
         // For now, just return the fake data below.
         .then(() => callback(goals));
         //.then(val => callback(val));
      } catch (error) {
        // TODO: Let's handle this better.
        console.log("Error saving goals!");
        console.log(error);
        // Return the edited list.
        callback(goals);
      }
  }
}

// POJsO for a list of Goals.
export class GoalList {
  getUserId: () => string;
  addGoal: (Goal) => GoalList;
  addGoals: (Array<Goal>) => GoalList;
  getGoals: () => Array<Goal>;
  toJSONString: () => string;

  constructor(userId: string) {
    let _userId = userId;
    let _goals = [];

    this.getUserId = function() {
      return _userId;
    };

    this.addGoal = function(goal: Goal) {
      _goals.push(goal);
      return this;
    }

    this.addGoals = function(goals: Array<Goal>) {
      // Warnging! Use this with care.
      _goals = goals;
      return this;
    }

    this.getGoals = function() {
      return _goals;
    }

    this.toJSONString = function() {
      return JSON.stringify({
        userId: _userId,
        goalList: _goals.map(goal => { return goal.toJSONString(); })
      });
    }
  }

  static fromJSONString(json: string) {
    let jsonObj = JSON.parse(json);
    let goalListObj = new GoalList(jsonObj.userId);
    jsonObj.goalList.forEach((goalJson: string, i: number) => {
      jsonObj.goalList[i] = Goal.fromJSONString(goalJson);
    });
    return goalListObj.addGoals(jsonObj.goalList);
  }
}

// POJsO for a Goal.
export class Goal {
  getId: () => string;
  getText: () => string;
  getCreateDate: () => string;
  toJSONString: () => string;

  constructor(id: string, text: string, date: string) {
    let _id = id;
    let _text = text;
    let _date = date;

    this.getId = function() {
      return _id;
    };

    this.getText = function() {
      return _text;
    }

    this.getCreateDate = function() {
      return _date;
    }

    this.toJSONString = function() {
      return JSON.stringify({
        goalId: _id,
        goalText: _text,
      });
    }
  }

  static fromJSONString(json: string) {
    let jsonObj = JSON.parse(json);
    return new Goal(jsonObj.goalId, jsonObj.goalText, jsonObj.goalCreateDate);
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

//
// API Examples.
//

// GET goals/
// Represents the list of user goals.  The lastState is included to make
// rendering the Daily Goals screen efficient.
const goals = {
  version: 1,
  userId: "SomeIDString", // Flattened from a user object elsewhere.
  goalList: [
    {
      goalId: "12",
      goalText: "It’s the ship that made the Kessel run in less than twelve parsecs. I’ve outrun Imperial starships. Not the local bulk cruisers, mind you. I’m talking about the big Corellian ships, now. She’s fast enough for you, old man",
      goalCreateDate: "2018-05-31", // ISO 8601, UTC, but day only.
      lastState: {
        date: "2018-06-02", // ISO 8601, UTC, but day only.
        state: "NO",
      },
    },
    {
      goalId: "34",
      goalText: "Traveling through hyperspace aint like dusting crops, farm boy.",
      goalCreateDate: "2018-05-31", // ISO 8601, UTC, but day only.
      lastState: {
        date: "2018-06-01", // ISO 8601, UTC, but day only.
        state: "YES",
      },
    },
  ],
};
