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
  TouchableHighlight,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import Swipeable from 'react-native-swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from '../Styles.js';

import GoalRow from '../components/GoalRow.js';
import LoadingSpinner from '../components/LoadingSpinner.js';

import {GoalsService, Goal, GoalList} from '../services/GoalsService.js';
import {UserService, User} from '../services/UserService.js';


// Button for delete on swipe.
function DeleteButton() {
  return (
    <TouchableHighlight
      style={styles.deleteButton}>
        <Icon
          name={'delete'}
          size={30}
          style={styles.deleteIcon}
        />
    </TouchableHighlight>
  );
}

type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  isSwiping: boolean,
  dataLoaded: boolean,
  user: User | null,
  goals: GoalList | null,
};

// Daily Goals Screen
export default class DailyScreen extends Component<Props, State> {
  static navigationOptions = {
    title: 'Goal Status',
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
    },
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      isSwiping: false,
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
      <ScrollView scrollEnabled={!this.state.isSwiping}>
      {this.state.goals.getGoals().map((g: Goal, index: number) => {
        console.log("goal id: " + g.getId() + " goal text: " + g.getText());
        return (
          <Swipeable
            key={index}
            leftButtons={[<DeleteButton />]}
            onSwipeStart={() => {
              this.setState({isSwiping: true});
            }}
            onSwipeRelease={() => {
              this.setState({isSwiping: false});
            }}>
            <GoalRow label={g.getText()} id={g.getId()} />
          </Swipeable>
        )
      })}
      </ScrollView>
    );
  }
}
