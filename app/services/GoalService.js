/**
 * Data service for GoalTender Goals.  Encapsulates business logic.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import GoalStorage from '../storage/GoalStorage.js';
import StateStorage from '../storage/StateStorage.js';

import { Goal, GoalList } from '../storage/data/Goal.js';
import { State } from '../storage/data/State.js';

import { nowDate } from '../Dates.js';


// TODO: Add off-device persistence via API.
export default class GoalService {
  // Get the list of incomplete goals for this user, along with today's states.
  static async getIncompleteGoalsWithTodayStates(
    userId: string,
    callback: (GoalList) => void) {
      // 1. Get the list of today's goals.
      return GoalService.getIncompleteGoals(
        userId,
        (goalList: GoalList) => {

          // 2. Get today's states for the incomplete goals only.
          StateStorage.getStatesForDate(
            userId,
            goalList.getGoals().map((goal: Goal) => goal.getId()),
            nowDate(),
            (states: Array<State>) => {

              // 3. Combine and return.
              callback(goalList.addStates(states));
            }
          ).catch((error) => {
            console.log("in getGoals Step 2: " + error);
            callback(goalList);
        });
      });
  }

  // Get the list of all goals for this user.
  static async getGoals(
    userId: string,
    callback: (GoalList) => void) {
      return GoalStorage.getGoals(
        userId,
        (goalList: GoalList) => callback(goalList));
  }

  // Get the list of all incomplete goals for this user.
  static async getIncompleteGoals(
    userId: string,
    callback: (GoalList) => void) {
      return GoalStorage.getGoals(
        userId,
        (goalList: GoalList) =>  {
          // Clean out complete goals.
          const completeGoals:Array<Goal> =
            goalList.getGoals().filter((g: Goal) => g.getComplete());
          completeGoals.forEach((g: Goal) => {
            goalList.deleteGoal(g.getId());
          });

          callback(goalList);
        });
  }

  // Get the list of just completed goals for this user.
  static async getCompletedGoals(
    userId: string,
    callback: (GoalList) => void) {
      return GoalStorage.getGoals(
        userId,
        (goalList: GoalList) => {
          // Clean out incomplete goals.
          const incompleteGoals:Array<Goal> =
            goalList.getGoals().filter((g: Goal) => !g.getComplete());
          incompleteGoals.forEach((g: Goal) => {
            goalList.deleteGoal(g.getId());
          });

          callback(goalList);
        });
  }

  // Get all historical state for a goal, in date:string -> state:State format.
  static async getStatesForGoal(
    userId: string,
    goalId: string,
    callback: (Map<string, State>) => void) {
      return StateStorage.getStatesForGoal(userId, goalId, callback);
  }

  // Save a new state for a goal for today
  static setGoalState(
    userId: string,
    goalId: string,
    goalState: number,
    callback: (?State) => void) {
      return StateStorage.setState(
        userId, goalId, goalState, nowDate(), callback);
  }

  // Mark a goal as completed.
  static completeGoal(
    userId: string,
    goalId: string,
    callback: (GoalList) => void) {
      return GoalStorage.completeGoal(userId, goalId, callback);
  }

  // Simple add goal, callback executed with the new Goal.
  static addGoal(
    userId: string,
    goalText: string,
    callback: (Goal) => void) {
      return GoalStorage.addGoal(userId, goalText, callback);
  }

  // Simple remove goal.
  // Callback executed with the updated GoalList.
  static async deleteGoal(
    userId: string,
    goalId: string,
    callback: (GoalList) => void) {
      return GoalStorage.deleteGoal(userId, goalId, callback);
  }
}
