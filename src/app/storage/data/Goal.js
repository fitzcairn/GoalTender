/**
 * Data objects for Goals.
 *
 * @author Steve Martin
 *
 * @flow
 */

 import { State, StateValues } from './State.js';


 // POJsO for a Goal.
 export class Goal {
   getId: () => string;
   getText: () => string;
   getStateValue: () => number;
   getCreateDate: () => string;
   setCreateDate: (string) => Goal;
   getComplete: () => boolean;
   setComplete: (boolean) => Goal;
   setState: (State) => Goal;
   toJSONString: () => string;

   constructor(
     id: string, text: string, date: string, complete:boolean = false) {

     let _id = id;
     let _text = text;
     let _date = date;
     let _complete = complete;
     let _state = null;

     this.getId = function() {
       return _id;
     };

     this.getText = function() {
       return _text;
     }

     this.getCreateDate = function() {
       return _date;
     }

     this.setCreateDate = function(date:string) {
       _date = date;
       return this;
     }

     this.getText = function() {
       return _text;
     }

     this.getComplete = function() {
       return _complete;
     }

     this.getStateValue = function() {
       if (_state == null) return StateValues.NONE;
       return _state.getState();
     }

     this.setState = function(state: State) {
       _state = state;
       return this;
     }

     this.setComplete = function(complete: boolean) {
       _complete = complete;
       return this;
     }

     // Note that goal states aren't saved with goals.  The authority on
     // goal states is elsewhere/stored separately.
     this.toJSONString = function() {
       return JSON.stringify({
         goalId: _id,
         goalText: _text,
         goalCreateDate: _date,
         complete: _complete,
       });
     }
   }

   static fromJSONString(json: string) {
     let jsonObj = JSON.parse(json);
     return new Goal(
       jsonObj.goalId,
       jsonObj.goalText,
       jsonObj.goalCreateDate,
       jsonObj.complete);
   }
 }

// POJsO for a list of Goals.
export class GoalList {
  getUserId: () => string;
  addGoal: (Goal) => GoalList;
  addGoals: (Array<Goal>) => GoalList;
  addStates: (Array<State>) => GoalList;
  deleteGoal: (string) => GoalList;
  getGoal: (string) => ?Goal;
  getGoals: () => Array<Goal>;
  toJSONString: () => string;

  constructor(userId: string) {
    let _userId = userId;
    const _goalMap:Map<string, Goal> = new Map();

    this.getUserId = function() {
      return _userId;
    };

    this.addGoal = function(goal: Goal) {
      _goalMap.set(goal.getId(), goal);
      return this;
    }

    this.addGoals = function(goals: Array<Goal>) {
      goals.forEach(goal => _goalMap.set(goal.getId(), goal));
      return this;
    }

    // Add states to goals that exist.
    this.addStates = function(states: Array<State>) {
      states.forEach(state => {
        if (state) {
          const goal:?Goal = _goalMap.get(state.getGoalId());
          if (goal)
            goal.setState(state);
        }
      });
      return this;
    }

    // Return a shallow copy of the goals.
    this.getGoals = function() {
      return Array.from(_goalMap.values());
    }

    // Return a reference to a given goal.
    this.getGoal = function(goalId: string) {
      return _goalMap.get(goalId);
    }

    // Return a shallow copy of the goals.
    this.deleteGoal = function(goalId: string) {
      _goalMap.delete(goalId);
      return this;
    }

    this.toJSONString = function() {
      return JSON.stringify({
        userId: _userId,
        goalList: this.getGoals().map(goal => { return goal.toJSONString(); })
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
