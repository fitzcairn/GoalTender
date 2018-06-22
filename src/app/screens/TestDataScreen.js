/**
 * Not an actual screen; toolbox to reset AsyncStorage state.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  Alert,
  AsyncStorage,
  Button,
  View,
} from 'react-native';

// Storage
import UserStorage from '../storage/UserStorage.js';
import GoalStorage from '../storage/GoalStorage.js';
import StateStorage from '../storage/StateStorage.js';

// Data
import { User } from '../storage/data/User.js';
import { Goal } from '../storage/data/Goal.js';

import { getDaysBetweenDisplay, getTwoMonthsAgo } from '../Dates.js';


type Props = {
};

type State = {
  goals: Map<string, Goal>|null;
}

const _goalMap:Map<string, Goal> = new Map();

// Simple Test Data screen.
export default class TestDataScreen extends Component<Props> {
  _resetUser(hasSeenFTUX? : boolean) {
    UserStorage.upsertUser(
      UserStorage._defaultId,
      () => { Alert.alert("User reset" + (hasSeenFTUX? " with FTUX" : " no FTUX"))},
      { hasSeenFTUX: hasSeenFTUX });
  }

  _clear() {
    AsyncStorage.clear(() => { Alert.alert("Storage Cleared!")});
  }

  _addGoals() {
    GoalStorage.addGoal(
      UserStorage._defaultId,
      "Work out at least 30 minutes.", (g1: Goal) => {
        _goalMap.set(g1.getId(), g1);
        GoalStorage.addGoal(
          UserStorage._defaultId,
          "Collaborate with someone on solving a problem.", (g2: Goal) => {
            _goalMap.set(g2.getId(), g1);
            GoalStorage.addGoal(
              UserStorage._defaultId,
              "Ask at least one question in a meeting.", (g3: Goal) => {
                _goalMap.set(g3.getId(), g1);
                GoalStorage.addGoal(
                  UserStorage._defaultId,
                  "Express thanks for at least one contribution from someone else.", (g4: Goal) => {
                    _goalMap.set(g4.getId(), g1);
                    GoalStorage.addGoal(
                      UserStorage._defaultId,
                      "Smile at one person.", (g5: Goal) => {
                        _goalMap.set(g5.getId(), g1);
                        Alert.alert("Goals added!");
                      },
                      getTwoMonthsAgo()
                    );
                  },
                  getTwoMonthsAgo()
                );
              },
              getTwoMonthsAgo()
            );
          },
          getTwoMonthsAgo()
        );
      },
      getTwoMonthsAgo()
    );
  }


  _getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  _addState() {
    if (Array.from(_goalMap.keys()).length == 0)
      return Alert.alert("No goals to add state to!");

    // Get a set of days.
    const days = getDaysBetweenDisplay('2018-05-01', '2018-06-20');

    // Set states for each goal, randomizing as much as possible.
    for (let goalId: string of _goalMap.keys()) {

      let dates:Array<string> = days.map((day) => {
        if (this._getRandomInt(3) > 0)
        //if (parseInt(day[1].split(' ', 2)[1]) % 3 > 0)
          return day[0];
      }).filter(date => typeof date != 'undefined');

      let states = dates.map((date, index) => {
        return this._getRandomInt(2) + 1;
      });

      StateStorage.setStates(
        UserStorage._defaultId,
        goalId,
        dates,
        states,
        () => { Alert.alert("States added for " + goalId); });
    }
  }

  render() {
    return (
      <View>
        <Button title='Clear Data' onPress={() => this._clear()}/>
        <Button title='Reset User, No FTUX' onPress={() => this._resetUser()}/>
        <Button title='Reset User, Has Seen FTUX' onPress={() => this._resetUser(true)}/>
        <Button title='Add Test Goals' onPress={() => this._addGoals()}/>
        <Button title='Add Test State' onPress={() => this._addState()}/>
      </View>
    );
  }
}
