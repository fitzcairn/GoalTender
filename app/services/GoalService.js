/**
 * Data service for GoalTender Goals.  Encapsulates business logic.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { generateId, parseISODateString, nowDate } from '../Util.js';

import GoalStorage from '../storage/GoalStorage.js';
import StateStorage from '../storage/StateStorage.js';

import { Goal, GoalList } from '../storage/data/Goal.js';
import { State, StateList } from '../storage/data/State.js';


// TODO: Add off-device persistence via API.
export default class GoalService {

  // Get the list of goals for this user, along with today's states.
  static async getGoalsWithTodayStates(
    userId: string,
    callback: (GoalList) => void) {
      /*
        1. Get the list of goals.
        2. Get today's states for the goals.
        3. Combine and return.
      */
      return GoalStorage.getGoals(userId, (goalList: GoalList) => {
        StateStorage.getStatesForToday(
          userId,
          goalList.getGoals().map((goal: Goal) => goal.getId()),
          (states: Array<State>) => callback(goalList.addStates(states))
        ).catch((error) => {
          console.log(error)
          callback(goalList);
        });
      });
  }

  // Save a new state for a goal.
  static setGoalState(
    userId: string,
    goalId: string,
    goalState: number,
    callback: (?State) => void) {
      return StateStorage.setState(userId, goalId, goalState, callback);
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
    goalId: string,
    goals: GoalList,
    callback: (GoalList) => void) {
      return GoalStorage.deleteGoal(goalId, goals, callback);
  }
}
