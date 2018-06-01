/**
 * Data service for GoalTender FTUX.
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

// TODO: Change this.
const key = 'FTUX';

export default class FTUXService {
  static async hasFTUX(callback: (boolean) => void) {
    try {
      return AsyncStorage.getItem(key)
        .then(val => callback(val == "true"));
        //.then(val => callback(false));
    } catch (error) {
      console.log(error);
      // Go ahead and show FTUX.
      callback(false);
    }
  }

  static async setFTUX() {
    try {
      AsyncStorage.setItem(key, "true");
    } catch (error) {
      // Ah well, user will see FTUX next time too.
      console.log(error);
    }
  }
}
