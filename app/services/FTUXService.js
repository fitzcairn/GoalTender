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
  static async hasFTUX(callback: (string) => void) {
    try {
      return AsyncStorage.getItem(key)
        .then(val => callback(val));
    } catch (error) {
      callback("false");
      throw error;
    }
  }

  static async setFTUX() {
    try {
      AsyncStorage.setItem(key, "penis");
    } catch (error) {
      // Ah well, user will see FTUX next time too.
      throw error;
    }
  }
}
