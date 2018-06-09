/**
 * Export service for GoalTender goals and states.  Encapsulates business logic.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import GoalStorage from '../storage/GoalStorage.js';
import StateStorage from '../storage/StateStorage.js';
import UserStorage from '../storage/UserStorage.js';

import { Goal, GoalList } from '../storage/data/Goal.js';
import { State } from '../storage/data/State.js';
import { User } from '../storage/data/User.js';

import { nowDate, getDaysBetween, isBefore } from '../Dates.js';
import { escapeString } from '../Util.js';

export default class ExportService {

  static async _handleError(
    fail: () => void,
    error: string,
    msg: string) {
    console.log("Error in generateGoalDataFile " + msg + ": " + error);
    fail();
  }


  /* Generate a data file, returning the location.
    Output looks like (header row first, example date second):

                                              (first date)      (last date)
    GoalID, GoalText Created     Complete?    2018-05-01    ... 2018-06-01
    {ID}    {TEXT}   {DATETIME}  {true|false} {"Yes"|"No"|null} ...
  */
  static async generateGoalDataFile(
    success: (string) => void,
    fail: () => void) {
      // Step 1: Get the user.
      return UserStorage.getUser(
        null,
        (user: User) => {

        // Step 2: Load the goals.
        GoalStorage.getGoals(
          user.getId(),
          (goalList: GoalList) => {

          // Step 3: Load the states for all goals for all days.
          StateStorage.getStates(
            user.getId(),
            goalList,
            (goalStateMap: Map<string, Map<string, State>>) => {

              // Step 4: Generate the CSV
              // goalStateMap: Map(goalId:string => Map(date:string => State))
              const csvColsList = ["Goal Id", "Goal Text", "Goal Created", "Complete"];

              // Get the full range of dates, i.e. num columns we need.
              // Take advantage of the fact that keys are sorted lexigraphically when
              // fetching from storage.
              let firstDate:string = "";
              let lastDate:string = "";

              Array.from(goalStateMap.values())
                .forEach((dateStateMap:Map<string, State>) => {
                  const dateList:?Array<string> = Array.from(
                    dateStateMap.keys());
                  if (dateList &&
                      (firstDate == "" || isBefore(dateList[0], firstDate)))
                    firstDate = dateList[0];
                  if (dateList &&
                      (lastDate  == "" || isBefore(
                        lastDate, dateList[dateList.length - 1])))
                    lastDate = dateList[dateList.length - 1];
                });

              // Generate the date columns we'll need.
              const datesInCSVList = getDaysBetween(firstDate, lastDate);
              const csvList = [];

              // Add header.
              csvList.push(
                ["Goal Id", "Goal Text", "Goal Created", "Complete"]
                .concat(datesInCSVList));

              // Fill in rest of list.
              Array.from(goalStateMap.keys()).forEach((goalId: string) => {
                const csvLineList = [];
                const goal:?Goal = goalList.getGoal(goalId);
                const dateStateMap:?Map<string, State> = goalStateMap.get(
                  goalId);
                if (goal && dateStateMap) {
                  csvLineList.push(
                    goalId,
                    escapeString(goal.getText()),
                    goal.getCreateDate(),
                    new Boolean(goal.getComplete()).toString());
                  datesInCSVList.forEach((date:string) => {
                    const state:?State = dateStateMap.get(date);
                    if (state) csvLineList.push(state.getStateString());
                    else       csvLineList.push("");
                  });
                }
                if (csvLineList) csvList.push(csvLineList);
              });

              // Hand off the csv back to the success callback.
              const csv:string = csvList
                .map((line:Array<string|number>) => line.join(","))
                .join("\n");
              success(csv);

            }).catch((error) => this._handleError(fail, error, "Step 3"));
          }).catch((error) => this._handleError(fail, error, "Step 2"));
      }).catch((error) => this._handleError(fail, error, "Step 1"));
  }

}
