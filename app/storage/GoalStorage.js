/**
 * Handles fetch/store for goals.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { generateId, parseISODateString, nowDate } from '../Util.js';
import { Goal, GoalList } from './data/Goal.js';


// TODO: Sync with off-device persistence via API.
export default class GoalStorage {
  /* Goals are stored as a list rather than individually.  This optimizes for
     the common case -- displaying your list of goals -- over random access.

    There will be relatively few goals on average, so this should be ok.
  */
  static _makeKey(userId: string) {
    return 'goal:' + userId
  }

  static _makeEmptyGoalList(userId: string) {
    return new GoalList(userId);
  }

  /* Get the list of goals for this user.  Does not fetch goal state.

    REST equivalent:
      GET users/{id}/goals

    Example return value:
      {
        version: 1,
        userId: "SomeIDString",
        goalList: [
          {
            goalId: "12",
            goalText: "Text",
            goalCreateDate: "2018-05-31", // ISO 8601, UTC, but day only.
          },
        ],
      }
  */
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

  /* Add a goal.  New Goal object is handed to callback.

    REST equivalent:
      POST users/{id}/goals

    Example return value:
      {
        goalId: "12",
        goalText: "Text",
        goalCreateDate: "2018-05-31", // ISO 8601, UTC, but day only.
      }
  */
  static addGoal(
    userId: string,
    goalText: string,
    callback: (Goal) => void) {
      const goal = new Goal(generateId(), goalText, nowDate());
      try {
        this.getGoals(
          userId,
          (goals: GoalList) => {
            // Have a list, now add and save back.
            goals.addGoal(goal);

            AsyncStorage.setItem(this._makeKey(userId), goals.toJSONString())
              .then(() => callback(goal))
              .catch((error) => {
                console.log(error);
              });
          }
        );
      } catch (error) {
        console.log(error);
        callback(goal);
      }
  }

  /* Remove a goal for this user.  Hands the updated list of goals to the
     callback.

    REST equivalent:
      DELETE users/{id}/goals/{id}

    Example return value:
      {
        version: 1,
        userId: "SomeIDString",
        goalList: [
          {
            goalId: "12",
            goalText: "Text",
            goalCreateDate: "2018-05-31", // ISO 8601, UTC, but day only.
          },
        ],
      }
  */
  static async deleteGoal(
    goalId: string,
    goals: GoalList,
    callback: (GoalList) => void) {
      try {
       return AsyncStorage.setItem(
         this._makeKey(goals.getUserId()),
           goals.deleteGoal(goalId).toJSONString())
         .then(() => callback(goals));

      } catch (error) {
        console.log(error);
        callback(goals);
      }
  }
}
