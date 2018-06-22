/**
 * Handles fetch/store for goals.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { generateId, log } from '../Util.js';
import { nowDate } from '../Dates.js';
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
            complete: false,
            goalCreateDate: "2018-05-31", // ISO 8601, UTC, but day only.
          },
        ],
      }
  */
  static async getGoals(
    userId: string,
    callback: (GoalList) => void
  ) {
  const empty:GoalList = this._makeEmptyGoalList(userId);

  return AsyncStorage.getItem(this._makeKey(userId))
    .then((goalString) => {
      if (goalString == null)
        callback(empty);
      else
        callback(GoalList.fromJSONString(goalString));
    })
    .catch((error) => {
      log(error);
      callback(empty);
    });
}

  /* Add a goal.  New Goal object is handed to callback.

    REST equivalent:
      POST users/{id}/goals

    Example return value:
      {
        goalId: "12",
        goalText: "Text",
        complete: false,
        goalCreateDate: "2018-05-31", // ISO 8601, UTC, but day only.
      }
  */
  static addGoal(
    userId: string,
    goalText: string,
    callback: (Goal) => void,
    createDate: ?string, // Optional goal backdate.
  ) {
    const userKey = this._makeKey(userId);
    const goal = new Goal(generateId(), goalText, nowDate());

    if (createDate != null) goal.setCreateDate(createDate);

    return AsyncStorage.getItem(userKey)
      .then((goalString) =>  {
        const goals:GoalList = (goalString == null ?
          this._makeEmptyGoalList(userId) :
          GoalList.fromJSONString(goalString));

        // Have a list, now add and save back.
        goals.addGoal(goal);

        // Return promise from setting item.
        return AsyncStorage.setItem(userKey, goals.toJSONString())
      })
      .then(() => callback(goal))
      .catch((error) => {
        log(error);
      })
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
            complete: false,
            goalCreateDate: "2018-05-31", // ISO 8601, UTC, but day only.
          },
        ],
      }
  */
  static async deleteGoal(
    userId: string,
    goalId: string,
    callback: (GoalList) => void
  ) {

  // Step 1: fetch the list of goals.
  this.getGoals(
    userId,
    (goals: GoalList) => {

      // Step 2: delete the goal.
      goals.deleteGoal(goalId);

      // Step 3: Save the goallist back.
      AsyncStorage.setItem(this._makeKey(userId), goals.toJSONString())
        .then(() => callback(goals))
    }
  );
}

  /* Mark a goal as completed.  Hands the updated goal to the
     callback.

    REST equivalent:
      PUT users/{id}/goals/{id}/complete

    Example return value:
      {
        goalId: "12",
        complete: true,
        goalText: "Text",
        goalCreateDate: "2018-05-31", // ISO 8601, UTC, but day only.
      }
  */
  static async completeGoal(
    userId: string,
    goalId: string,
    callback: (GoalList) => void
  ) {
    // Step 1: fetch the list of goals.
    this.getGoals(
      userId,
      (goals: GoalList) => {
        // Step 2: mark the goal as completed.
        const goal:?Goal = goals.getGoal(goalId);
        if (goal == null)
          throw "Goal " + goalId + " not found in completeGoal step 2";
        goal.setComplete(true);

        // Step 3: Save the goallist back.
        AsyncStorage.setItem(this._makeKey(userId), goals.toJSONString())
          .then(() => callback(goals))
      }
    );
  }
}
