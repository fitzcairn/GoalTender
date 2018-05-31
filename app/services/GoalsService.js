/**
 * Data service for GoalTender Goals.
 * @author Steve Martin
 *
 * @flow
 */

 import { AsyncStorage } from 'react-native';

 const keyPrefix = 'goalList:';

// TODO: Add off-device persistence via API.
 export class GoalsService {

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

   // Get the list of goals for this user.
   static async getGoalList(
     userId: string,
     callback: (GoalList) => void) {
     try {
       const key = keyPrefix + userId;
       return AsyncStorage.getItem(key)
         // For now, just return the fake data below.
         .then(val => callback(this._makeGoalTestList()));
         //.then(val => callback(val));
     } catch (error) {
       // Return an empty goal list.
       callback(this._makeEmptyGoalList(userId));
     }
   }
 }

// POJsO for a list of Goals.
export class GoalList {
  getUserId: () => string;
  addGoal: (Goal) => Array<Goal>;
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
      return _goals;
    }

    this.getGoals = function() {
      return _goals;
    }

    this.toJSON = function() {
      return {
        userId: _userId,
        goalList: _goals.map(goal => { return goal.toJSON(); })
      };
    }
  }
}

// POJsO for a Goal.
export class Goal {
 getId: () => string;
 getText: () => string;
 toJSON: () => Object;

 constructor(id: string, text: string) {
   let _id = id;
   let _text = text;

   this.getId = function() {
     return _id;
   };

   this.getText = function() {
     return _text;
   }

   this.toJSON = function() {
     return {
       goalId: _id,
       goalText: _text,
     };
   }
 }
}



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
    },
    {
      goalId: "34",
      goalText: "Traveling through hyperspace aint like dusting crops, farm boy.",
    },
    {
      goalId: "56",
      goalText: "Get in there you big furry oaf, I don’t care what you smell!"
    },
    {
      goalId: "78",
      goalText: "Luke, at that speed do you think you’ll be able to pull out in time?"
    },
    {
      goalId: "90",
      goalText: "Put that thing away before you get us all killed."
    },
    {
      goalId: "09",
      goalText: "You’ve got something jammed in here real good."
    },
    {
      goalId: "87",
      goalText: "Aren’t you a little short for a stormtrooper?"
    },
    {
      goalId: "65",
      goalText: "You came in that thing? You’re braver than I thought."
    },
    {
      goalId: "43",
      goalText: "Sorry about the mess…"
    },
    {
      goalId: "21",
      goalText: "Look at the size of that thing!"
    },
    {
      goalId: "6969",
      goalText: "Curse my metal body, I wasn’t fast enough!"
    },
    {
      goalId: "420",
      goalText: "She may not look like much, but she’s got it where it counts, kid."
    },
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
      goalId: "12345",
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
      goalId: "67890",
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
