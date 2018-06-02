/**
 * Data service for GoalTender Goals.
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';


// TODO: Add off-device persistence via API.
export class GoalsService {
  static _date = new Date();

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
     goalList.addGoal(new Goal(g.goalId, g.goalText));
    });
    return goalList;
  }

  // From https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // Should have good enough entropy for this little app.
  static generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Get the list of goals for this user.
  static async getGoalList(
    userId: string,
    callback: (GoalList) => void) {
      try {
      return AsyncStorage.getItem(this._makeKey(userId))
       // For now, just return the fake data below.
        .then((goalString) => {
          //callback(this._makeGoalTestList());
          callback(GoalList.fromJSONString(goalString));
        });
       //.then(val => callback(val));
      } catch (error) {
        console.log(error);
        // Return an empty goal list.
        callback(this._makeEmptyGoalList(userId));
      }
  }

  // Simple add goal, callback executed with the new Goal.
  static addToList(
    userId: string,
    goalText: string,
    callback: (Goal) => void) {
      let goal = new Goal(userId, goalText, this._date.toISOString());

      try {
        // TODO: this is pretty gnarly, this whole service probably needs rewriting.
        this.getGoalList(
          userId,
          (goals: GoalList) => {
            // Have a list, now add and save back.
            goals.addGoal(goal);
            AsyncStorage.setItem(
              this._makeKey(userId), goals.toJSONString())
              // For now, just return the fake data below.
              .then(() => callback(goal))
              .catch((error) => {
                console.log(error);
              });
              //.then(val => callback(val));
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
  static async removeFromList(
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
  toJSON: () => Object;

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
 toJSON: () => Object;

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

// States for a Goal
export const GoalStateValues = Object.freeze({
  NONE: 0,
  NO:   1,
  YES:  2,
});


//
// For now, temporary goals structure for the API to parse and return.
//

// Represents the list of user goals.
const goals = {
  version: 1,
  userId: "SomeIDString", // Flattened from a user object elsewhere.
  goalList: [
    {
      goalId: "12",
      goalText: "It’s the ship that made the Kessel run in less than twelve parsecs. I’ve outrun Imperial starships. Not the local bulk cruisers, mind you. I’m talking about the big Corellian ships, now. She’s fast enough for you, old man",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },/*
    {
      goalId: "34",
      goalText: "Traveling through hyperspace aint like dusting crops, farm boy.",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "56",
      goalText: "Get in there you big furry oaf, I don’t care what you smell!",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "78",
      goalText: "Luke, at that speed do you think you’ll be able to pull out in time?",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "90",
      goalText: "Put that thing away before you get us all killed.",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "09",
      goalText: "You’ve got something jammed in here real good.",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "87",
      goalText: "Aren’t you a little short for a stormtrooper?",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "65",
      goalText: "You came in that thing? You’re braver than I thought.",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "43",
      goalText: "Sorry about the mess…",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "21",
      goalText: "Look at the size of that thing!",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "6969",
      goalText: "Curse my metal body, I wasn’t fast enough!",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },
    {
      goalId: "420",
      goalText: "She may not look like much, but she’s got it where it counts, kid.",
      goalCreateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
    },*/
  ],
}

// All state for goals.
// APIs will likely return portions of this.
const goalState = {
  version: 1,
  userId: "SomeIDString", // Flattened from a user object elsewhere.
  lastUpdateDate: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
  goalList: [
    {
      goalId: "12",
      goalStates: [ // Always in descending order of date.
        {
          date: "2018-05-31T11:45:12,780210000-00:00", // ISO 8601, UTC
          state: 1, // Yes
        },
        {
          date: "2018-05-30T11:45:12,780210000-00:00", // ISO 8601, UTC
          state: 0, // No
        },
        { // Note that days can be skipped for this goal.
          date: "2018-05-27T11:45:12,780210000-00:00", // ISO 8601
          state: 1, // Yes
        },
      ],
    },
    {
      goalId: "34",
      goalStates: [ // Always in descending order of date.
        {
          date: "2018-05-30T11:45:12,780210000-00:00", // ISO 8601, UTC
          state: 1, // Yes
        },
        {
          date: "2018-05-29T11:45:12,780210000-00:00", // ISO 8601, UTC
          state: 1, // Yes
        },
        { // Note that days can be skipped for this goal.
          date: "2018-05-28T11:45:12,780210000-00:00", // ISO 8601, UTC
          state: 0, // No
        },
      ],
    },
  ],
}
