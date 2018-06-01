/**
 * Daily Goals screen.  This is where the majority of app interaction will take place.
 * Steve Martin
 * steve@stevezero.com
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  View,
  ScrollView,
  TouchableHighlight,
  Alert,
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

import {GoalsService, Goal, GoalList, GoalStateValues} from '../services/GoalsService.js';
import {UserService, User} from '../services/UserService.js';


// Button for delete on swipe.
function DeleteButton(
  {
    onPress,
  }: {
    onPress: () => void,
  }) {
  return (
    <TouchableHighlight
      underlayColor={'white'}
      style={styles.deleteButton}
      onPress={() => {onPress()}}>
      <Icon
        name={'delete-forever'}
        size={50}
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
  swipeable = null;
  deleteOpen = false;
  deleteOpenIndex = -1;

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
      dataLoaded: false,
      isSwiping: false,
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

  _handleDelete(goalId: string, index: number) {
    // Could this be called before we have data?
    if (this.state.dataLoaded) {
      console.log("about to delete goal: " + goalId + " at index: " + index);
      GoalsService.removeFromList(
        goalId,
        this.state.goals,
        (goals: GoalList) => {
          // Success!  Set state and trigger refresh.
          console.log("goal deleted!");

          this.setState({
            goals: goals,
          });
        },
        index
      ).catch((error) => {
        console.log(error);
      });
    }
    return true;
  }

  _closeDrawer() {
    if (this.deleteOpen && this.swipeable) {
      this.swipeable.recenter();
      this.deleteOpen = false;
    }
  }

  render() {
    if (!this.state.dataLoaded)
      return (
        <LoadingSpinner modal={false} />
      );
    return (
      <ScrollView
        scrollEnabled={!this.state.isSwiping}>
        {this.state.goals.getGoals().map((g: Goal, index: number) => {
          return (
            <Swipeable
              key={index}
              leftButtons={[
                <DeleteButton onPress={() => {
                  Alert.alert(
                    'Are you sure?',
                    'This will remove all saved progress for your goal.',
                    [
                      {text: 'Cancel', style: 'cancel', onPress: () => {
                        this._closeDrawer();
                      }},
                      {text: 'Delete', onPress: () => {
                        this._closeDrawer();
                        this._handleDelete(g.getId(), index)
                      }},
                    ],
                    { cancelable: false }
                  )
                }} />
              ]}
              onSwipeStart={() => {
                this._closeDrawer();
                this.setState({isSwiping: true});
              }}
              onSwipeRelease={() => {
                this.setState({isSwiping: false});
              }}
              onLeftButtonsOpenComplete={(event, gestureState, ref) => {
                this.deleteOpen = true;
                this.deleteOpenIndex = index;
                this.swipeable = ref;
              }}
              onLeftButtonsCloseComplete={() => {
                this.deleteOpen = false;
              }}
              >
              {/* TODO: Set disabled correctly when this goalrow is open for deletion.*/}
              <GoalRow
                disabled={((this.deleteOpen && (this.deleteOpenIndex == index)) ? true : false)}
                label={g.getText()}
                id={g.getId()}
                state={GoalStateValues.NONE} />
            </Swipeable>
          )
        })}
      </ScrollView>
    );
  }
}
