/**
 * Daily Goals screen.  This is where the majority of app interaction will take place.
 * Steve Martin
 * steve@stevezero.com
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  Text,
  View,
  Button,
  ScrollView,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import styles from '../Styles.js';

import GoalRow from '../components/GoalRow.js';
import LoadingSpinner from '../components/LoadingSpinner.js';

import {GoalsService, Goal, GoalList} from '../services/GoalsService.js';
import {UserService, User} from '../services/UserService.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  dataLoaded: boolean,
  user: User | null,
  goals: GoalList | null,
};

// Daily Goals Screen
export default class DailyScreen extends Component<Props, State> {
  static navigationOptions = {
    title: 'Goal Status',
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      dataLoaded: false,
      user: null,
      goals: null,
    };
  }

  componentDidMount() {
    // First get the user data, then the goals.
    UserService.getUser(
      (user: User) => {
        // Great, we have a user, now kick off the goals fetch.
        // We don't set state first because there is nothing to redraw yet.
        GoalsService.getGoalList(
          user.getId(),
          (goals: GoalList) => {
            // Success!  Set state and trigger refresh.
            this.setState({
              dataLoaded: true,
              user: user,
              goals: goals,
            });
          }
        );
      }
    );
  }

  render() {
    if (!this.state.dataLoaded)
      return (
        <LoadingSpinner modal={false} />
      );
    return (
      <ScrollView>
      {this.state.goals.getGoals().map((g: Goal, index: number) => {
        console.log("goal id: " + g.getId() + " goal text: " + g.getText());
        return <GoalRow key={index} label={g.getText()} id={g.getId()} />
      })}
      </ScrollView>
    );
  }
}
