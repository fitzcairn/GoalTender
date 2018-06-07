/**
 * Storage service for States.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { State, StateDatesList } from './data/State.js';


// TODO: Add off-device persistence via API.
export default class StateStorage {
  static _makeKey(userId: string, goalId: string, day: string|null) {
    if (day == null)
      return 'goalState:' + userId + ":" + goalId;
    return 'goalState:' + userId + ":" + goalId + ":" + day;
  }

  /* Get the per-goal states for a date.  Hands off a list of States to the
     callback.

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
  static async getStates(
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
  static async getStatesFor(
    userId: string,
    goalId: string,
    callback: (Map<string, State>) => void) {
      try {
        // 1. Fetch the dates this goal has state for.
        AsyncStorage.getItem(
          this._makeKey(userId, goalId, null))
          .then((dateListJSON: string) => {
            // If there are no dates, then no progress has been made on this
            // goal.  This is a legit case.  Handle by invoking the callback
            // with a new map.
            if (dateListJSON == null)
              callback(new Map());
            else {
              // 2. Fetch all of the keys for those dates.
              const dateList = StateDatesList.fromJSONString(dateListJSON);
              const keys = dateList.getDates().map(
                (date: string) => this._makeKey(userId, goalId, date));
              return AsyncStorage.multiGet(keys)
                .then((resultList) => {
                  const dateMap = new Map();
                  if (resultList != null) {
                    resultList.forEach((keyValList) => {
                      if (keyValList[1] != null) {
                        const state:State = State.fromJSONString(keyValList[1]);
                        dateMap.set(state.getDate(), state);
                      }
                    });
                  }
                  callback(dateMap);
                })
                .catch((error) => {
                  console.log("In getStatesFor step 2: " + error);
                  callback(new Map());
                });
              }
            })
            .catch((error) => {
              console.log("In getStatesFor step 1: " + error);
              callback(new Map());
            });
      } catch (error) {
        console.log("getStatesFor: " + error);
        callback(new Map());
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
    callback: (State) => void) {
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
    callback: () => void) {
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
                callback(state);
              });
            })
      } catch (error) {
        console.log("In setSates step 1: " + error);
        callback(state);
      }
    }
}
