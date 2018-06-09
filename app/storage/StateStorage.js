/**
 * Storage service for States.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { State, StateDatesList } from './data/State.js';
import { Goal, GoalList } from '../storage/data/Goal.js';


// TODO: Add off-device persistence via API.
export default class StateStorage {
  static _makeKey(userId: string, goalId: string, day: string|null) {
    if (day == null)
      return 'goalState:' + userId + ":" + goalId;
    return 'goalState:' + userId + ":" + goalId + ":" + day;
  }

  /* Get the states for a date across all goals.  Hands off a list of States to
     the callback.

     REST equivalent:
       GET users/{id}/states/{date}

     Returns:
     {
       userId: "ID",
       stateList: [
         {
           goalId: "1234",
           date: "2018-06-01", // ISO 8601, UTC, but day only.
           state: "NO",
         },
       ],
     }
  */
  static async getStatesForDate(
    userId: string,
    goalIds: Array<string>,
    date: string,
    callback: (Array<State>) => void) {
      const keys = goalIds.map(
        goalId => this._makeKey(userId, goalId, date));
      try {
        return AsyncStorage.multiGet(keys)
          .then((resultList) => {
            if (resultList == null)
              callback([]);
            else {
              callback(resultList.map(keyValList => {
                if (keyValList[1] != null)
                  return State.fromJSONString(keyValList[1]);
              }));
            }
          });
      } catch (error) {
        console.log(error);
        callback([]);
      }
  }


  /* Get all states for all goals and all dates.  Note that this is likely to be
     quite slow--please take this into account when planning UI.

     REST equivalent:
       GET users/{id}/states/

     Returns:
     {
       userId: "ID",
       stateList: [
         {
           goalId: "1234",
           date: "2018-06-01", // ISO 8601, UTC, but day only.
           state: "NO",
         },
       ],
     }
  */
  static async getStates(
    userId: string,
    goalList: GoalList,
    callback: (Map<string, Map<string, State>>) => void
  ) {
    const goalStateMap: Map<string, Map<string, State>> = new Map();
    try {
      let keyList:Array<string> = [];

      // Generate date fetch keys for all goals.
      goalList.getGoals().forEach((goal: Goal) => {
        keyList.push(this._makeKey(userId, goal.getId(), null));
      })

      // 1. Fetch the dates with state for all goals.
      return AsyncStorage.multiGet(keyList)
        .then((keyValPairList: Array<Array<string>>) => {
          // No results --> invoke callback and return.
          if (keyValPairList.length == 0)
            return callback(goalStateMap);

          // Generate set of keys for all states for all goals.
          keyList = [];
          keyValPairList.forEach((keyStateDateList:Array<string>) => {
            if (keyStateDateList[1] != null) {
              const dateList = StateDatesList.fromJSONString(
                keyStateDateList[1]);
              dateList.getDates().forEach((date: string) => {
                keyList.push(this._makeKey(
                  dateList.getUserId(), dateList.getGoalId(), date));
              });
            }
          });

          // If we don't have any state, we're done; invoke the callback.
          if (keyList.length == 0)
            return callback(goalStateMap);

          // 2. Fetch all states for all goals and dates.
          return AsyncStorage.multiGet(keyList)
            .then((keyValPairList: Array<Array<string>>) => {
              // No results --> invoke callback and return.
              if (keyValPairList.length == 0)
                return callback(goalStateMap);

              // Build a Map(goalId:string => Map(date:string => State))
              keyValPairList.forEach((keyStateList:Array<string>) => {
                if (keyStateList[1] != null) {
                  const state:State = State.fromJSONString(keyStateList[1]);
                  const mapRef:?Map<string,State> = goalStateMap.get(
                    state.getGoalId());
                  if (mapRef)
                    mapRef.set(state.getDate(), state);
                  else
                    goalStateMap.set(state.getGoalId(),
                      new Map().set(state.getDate(), state));
                }
              });

              // Fetch complete.
              return callback(goalStateMap);
            }).catch((error) => {
              console.log("In getStates step 2: " + error);
              callback(new Map());
            });
        }).catch((error) => {
          console.log("In getStates step 1: " + error);
        })
    } catch (error) {
      console.log("getStates: " + error);
      callback(goalStateMap);
    }
  }

  /* Get all of the states for a specific goal.

     REST equivalent:
       GET users/{id}/goal/{id}/states

     Returns:
     {
       userId: "ID",
       stateList: [
         {
           goalId: "1234",
           date: "2018-06-01", // ISO 8601, UTC, but day only.
           state: "NO",
         },
       ],
     }
  */
  static async getStatesForGoal(
    userId: string,
    goalId: string,
    callback: (Map<string, State>) => void
  ) {
    const dateStateMap: Map<string, State> = new Map();
    try {
      // 1. Fetch the dates this goal has state for.
      AsyncStorage.getItem(
        this._makeKey(userId, goalId, null))
        .then((dateListJSON: string) => {
          // If there are no dates, then no progress has been made on this
          // goal.  This is a legit case.  Handle by invoking the callback
          // with a new map.
          if (dateListJSON == null)
            return callback(dateStateMap);

          // 2. Fetch all of the keys for those dates.
          const dateList = StateDatesList.fromJSONString(dateListJSON);
          const keys = dateList.getDates().map(
            (date: string) => this._makeKey(userId, goalId, date));
          return AsyncStorage.multiGet(keys)
            .then((resultList) => {
              if (resultList != null) {
                resultList.forEach((keyValList) => {
                  if (keyValList[1] != null) {
                    const state:State = State.fromJSONString(keyValList[1]);
                    dateStateMap.set(state.getDate(), state);
                  }
                });
              }
              return callback(dateStateMap);
            })
            .catch((error) => {
              console.log("In getStatesFor step 2: " + error);
              callback(dateStateMap);
            });
        })
        .catch((error) => {
          console.log("In getStatesFor step 1: " + error);
          callback(dateStateMap);
        });
    } catch (error) {
      console.log("getStatesFor: " + error);
      callback(dateStateMap);
    }
  }

  /* Write an updated state for a goal for a date.

     Rest equivalent:
       PUT users/{id}/goals/{id}/states/{today}
       PUT users/{id}/goals/{id}/state
  */
  static setState(
    userId: string,
    goalId: string,
    goalState: number,
    date: string,
    callback: (State) => void
  ) {
    const state = new State(goalState, goalId, date);
    try {

      // 1. Write the value for today so that the goals screen is correct.
      return AsyncStorage.setItem(
        this._makeKey(userId, goalId, date),
        state.toJSONString())
        .then(() => {

          // 2. Fetch the dates this goal has state for.
          AsyncStorage.getItem(
            this._makeKey(userId, goalId, null))
            .then((dateListJSON: string) => {

              // 3. Add this date to the list and commit back.
              const dateList = (dateListJSON == null ?
                new StateDatesList(userId, goalId).addDate(date) :
                StateDatesList.fromJSONString(dateListJSON));
              dateList.addDate(date);
              AsyncStorage.setItem(
                this._makeKey(userId, goalId, null),
                dateList.toJSONString())
                .then(() => {

                  // 4. Invoke the callback with the state object.
                  callback(state);
                })
                .catch((error) => {
                  console.log("In setSate step 3: " + error);
                  callback(state);
                });
              })
              .catch((error) => {
                console.log("In setSate step 2: " + error);
                callback(state);
              });
            });
    } catch (error) {
      console.log("In setSate step 1: " + error);
      callback(state);
    }
  }


  /* Replace all states across all dates for a goal.

     Rest equivalent:
       PUT users/{id}/goals/{id}/states/{today}
       PUT users/{id}/goals/{id}/state
  */
  static setStates(
    userId: string,
    goalId: string,
    dateList: Array<string>,
    stateList: Array<number>,
    callback: () => void
  ) {
    if (dateList.length != stateList.length)
      throw "Lengths don't match: " + dateList.length + " != " + stateList.length;
    try {

      // 1. Write the values for each date.
      const dayKeyVal = [];
      for (let i = 0; i < stateList.length; i++) {
        dayKeyVal.push([
          this._makeKey(userId, goalId, dateList[i]),
          new State(stateList[i], goalId, dateList[i]).toJSONString()]);
      }
      return AsyncStorage.multiSet(
        dayKeyVal)
        .then(() => {
          // 2. Construct a StateDatesList and set it.
          const dateListObj = new StateDatesList(userId, goalId);
          for (let i = 0; i < dateList.length; i++) {
            dateListObj.addDate(dateList[i]);
          }
          AsyncStorage.setItem(
            this._makeKey(userId, goalId, null),
            dateListObj.toJSONString())
            .then(() => {
              // 4. Invoke the callback.
              callback();
            })
            .catch((error) => {
              console.log("In setSates step 2: " + error);
              callback();
            });
          })
    } catch (error) {
      console.log("In setSates step 1: " + error);
      callback();
    }
  }
}
