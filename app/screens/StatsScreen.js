/**
 * GoalTender
 * A simple react native application to take this framework for a spin.
 * Steve Martin
 * steve@stevezero.com
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import LoadingSpinner from '../components/LoadingSpinner.js';

import GoalService from '../services/GoalService.js';
import UserService from '../services/UserService.js';

import { User } from '../storage/data/User.js'
import { Goal, GoalList } from '../storage/data/Goal.js'
import { StateValues } from '../storage/data/State.js'


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// Stats Screen
export default class StatsScreen extends Component<Props> {
  constructor(props: Object) {
    super(props);
  }

  componentDidMount() {
    this._refreshData();
  }

  componentDidUpdate() {
    // Did another screen send us here after changing the underlying data?
    if (this.props.navigation.getParam('refresh', false)) {
      this.props.navigation.state.params.refresh = false;
      this._refreshData();
    }
  }

  _refreshData() {
    // First get the user data, then the goals.
    UserService.getUser(
      null, // No userID until we integrate login.
      (user: User) => {
        // Great, we have a user, now kick off the goals fetch.
        // We don't set state first because there is nothing to redraw yet.
        GoalService.getGoalsWithTodayStates(
          user.getId(),
          (goals: GoalList) => {
            // Success!  Set state and trigger refresh.
            this.setState({
              dataLoaded: true,
              user: user,
              goals: goals,
            });
          }
        ).catch((error) => {
          console.log("DailyScreen -> _refreshData -> getGoals: " + error);
        });
      }
    ).catch((error) => {
      console.log("DailyScreen -> _refreshData -> getUser: " + error);
    });
  }

  render() {
    return (
      <View>
        <View>
          <Text style={styles.titleText}>Goal</Text>
          <Text style={styles.subTitleText}>Date</Text>
        </View>
        <ScrollView>
          <Text>Whee</Text>
        </ScrollView>
      </View>
    );
  }
}

// Local styles.
const styles = StyleSheet.create({
  titleView: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16,
  },
  subTitleText: {
    fontSize: Platform.OS === 'ios' ? 12 : 14,
    color: 'grey'
  },
  goalRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
    marginBottom: 1,
  },
  goalText: {
    flex: 1,
    color: 'black',
    marginLeft: 14,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  goalIcon: {
    backgroundColor: 'transparent',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalIconOff: {
    backgroundColor: 'transparent',
    color: '#cccccc',
  },
  goalYesIconOn: {
    backgroundColor: 'transparent',
    color: '#006600',
  },
  goalNoIconOn: {
    backgroundColor: 'transparent',
    color: '#cc0000',
  },
});
