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


export default class ExportService {
  static async _handleError(error: string, msg: string) {
    console.log("generateGoalDataFile " + msg + ": " + error);
    throw "Error generating data file!";
  }


  /* Generate a data file, returning the location.
    Output looks like (header row first, example date second):

                                              (first date)      (last date)
    GoalID, GoalText Created     Complete?    2018-05-01    ... 2018-06-01
    {ID}    {TEXT}   {DATETIME}  {true|false} {"Yes"|"No"|null} ...
  */
  static async generateGoalDataFile(
    callback: (string) => void) {
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
              const csvCols = ["Goal Id", "Goal Text", "Goal Created", "Complete"];

              // Get the full range of dates, i.e. num columns we need.
              // Take advantage of the fact that keys are sorted lexigraphically when
              // fetching from storage.
              let firstDate:string = "";
              let lastDate:string = "";

              console.log("ok, CSV time!");

              Array.from(goalStateMap.values()).forEach((dateMap:Map<string, State>) => {
                const dateList:?Array<string> = Array.from(dateMap.keys());
                console.log(dateList);
                if (dateList &&
                    (firstDate == "" || isBefore(dateList[0], firstDate)))
                  firstDate = dateList[0];
                if (dateList &&
                    (lastDate  == "" || isBefore(lastDate, dateList[dateList.length - 1])))
                  lastDate = dateList[dateList.length - 1];
              });

              // Generate the date columns we'll need.
              const datesInCSV = getDaysBetween(firstDate, lastDate);

              /*

              NEXT:
                for each goalid in the map:
                  create row array of strings
                  look up goal object in goalList, append info to row
                  for each date in datesInCSV
                    look up date in the Map<string, State
                    append state info to row.

                construct csv string from header, rows built above.

              */



              // Invoke the callback with the file name.
              callback("filename");
            }).catch((error) => this._handleError(error, "Step 3"));
          }).catch((error) => this._handleError(error, "Step 2"));
      }).catch((error) => this._handleError(error, "Step 1"));
  }

}
