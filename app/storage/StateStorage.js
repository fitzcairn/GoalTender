/**
 * Storage service for States.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import { nowDate } from '../Util.js';
import { State } from './data/State.js';


// TODO: Add off-device persistence via API.
export default class StateStorage {
  static _makeKey(userId: string, goalId: string, day: string) {
    return 'goalStateList:' + userId + ":" + goalId + ":" + day;
  }

  /* Get the per-goal states for today.  Hands off a list of States to the
     callback.

     REST equivalent:
       GET users/{id}/states/{today}

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
  static async getStatesForToday(
    userId: string,
    goalIds: Array<string>,
    callback: (Array<State>) => void) {
      const keys = goalIds.map(
        goalId => this._makeKey(userId, goalId, nowDate()));
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

  /* Write an updated state for a goal for today.  Returns the State object
     reflecting the update.

     Rest equivalent:
       PUT users/{id}/goals/{id}/states/{today}
       PUT users/{id}/goals/{id}/state
  */
  static setState(
    userId: string,
    goalId: string,
    goalState: number,
    callback: (State) => void) {
      const date = nowDate();
      const state = new State(goalState, goalId, nowDate());
      try {
        return AsyncStorage.setItem(
          this._makeKey(userId, goalId, date), state.toJSONString())
          .then(() => callback(state));
      } catch (error) {
        console.log(error);
        // TODO: Handle this better.
        callback(state);
      }
    }
}
