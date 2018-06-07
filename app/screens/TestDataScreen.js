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

import { getDaysBetween } from '../Dates.js';


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
      hasSeenFTUX);
  }

  _clear() {
    AsyncStorage.clear(() => { Alert.alert("Storage Cleared!")});
  }

  _addGoals() {
    GoalStorage.addGoal(
      UserStorage._defaultId,
      "Test Goal 1", (g1: Goal) => {
        _goalMap.set(g1.getId(), g1);
        GoalStorage.addGoal(
          UserStorage._defaultId,
          "Test Goal 2", (g2: Goal) => {
            _goalMap.set(g2.getId(), g1);
            GoalStorage.addGoal(
              UserStorage._defaultId,
              "Test Goal 3", (g3: Goal) => {
                _goalMap.set(g3.getId(), g1);
                GoalStorage.addGoal(
                  UserStorage._defaultId,
                  "Test Goal 4", (g4: Goal) => {
                    _goalMap.set(g4.getId(), g1);
                    GoalStorage.addGoal(
                      UserStorage._defaultId,
                      "Test Goal 5", (g5: Goal) => {
                        _goalMap.set(g5.getId(), g1);
                        Alert.alert("Goals added!");
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  _addState() {
    if (Array.from(_goalMap.keys()).length == 0)
      Alert.alert("No goals to add state to!");

    // Month of alternating dates.
    const days = getDaysBetween('2018-05-01', '2018-05-31');
    const dates = days.map((day) => {
      if (parseInt(day[1].split(' ', 2)[1]) % 3 > 0)
        return day[0];
    }).filter(date => typeof date != 'undefined');

    const states = dates.map((date, index) => {
      return (index % 2) + 1;
    });

    StateStorage.setStates(
      UserStorage._defaultId,
      Array.from(_goalMap.keys())[0],
      dates,
      states,
      () => { Alert.alert("States added!"); }
    );
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
