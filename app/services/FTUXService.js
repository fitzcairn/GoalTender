/**
 * Data service for GoalTender FTUX.
 * @author Steve Martin
 *
 * @flow
 */

 import React, { Component } from 'react';
 import { AsyncStorage } from 'react-native';

const key = 'FTUX';

export default class FTUXService {
  static async hasFTUX(callback: (boolean) => void) {
    try {
      return AsyncStorage.getItem(key)
        // TODO: Currently hardcoded to always show FTUX; remove.
        //.then(val => callback(val == "true"));
        .then(val => callback(false));
    } catch (error) {
      // Go ahead and show FTUX.
      callback(false);
    }
  }

  static async setFTUX() {
    try {
      AsyncStorage.setItem(key, "true");
    } catch (error) {
      // Ah well, user will see FTUX next time too.
    }
  }
}
