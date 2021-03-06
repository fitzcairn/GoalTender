/**
 * Daily Goals screen.  This is where the majority of app interaction will
 * take place.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';
import type { Node } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import Swipeable from 'react-native-swipeable';

import Localized from '../Strings.js';

import GlobalStyles from '../Styles.js';

import GoalRow from '../components/GoalRow.js';
import LoadingSpinner from '../components/LoadingSpinner.js';
import AddButton from '../components/AddButton.js';
import DeleteButton from '../components/DeleteButton.js';
import CompleteButton from '../components/CompleteButton.js';

import GoalService from '../services/GoalService.js';
import UserService from '../services/UserService.js';

import { User } from '../storage/data/User.js'
import { Goal, GoalList } from '../storage/data/Goal.js'
import { StateValues } from '../storage/data/State.js'

import { log } from '../Util.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  isSwiping: boolean,
  dataLoaded: boolean,
  forceRefresh: boolean,
  user: User | null,
  goals: GoalList | null,
};

// Daily Goals Screen
export default class DailyScreen extends Component<Props, State> {
  swipeable = null;
  drawerOpen = false;
  drawerOpenIndex = -1;

  constructor(props: Object) {
    super(props);
    this.state = {
      dataLoaded: false,
      forceRefresh: false,
      isSwiping: false,
      user: null,
      goals: null,
    };
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
        // We fetch only what we will display, which are incomplete goals.
        // We don't set state first because there is nothing to redraw yet.
        GoalService.getIncompleteGoalsWithTodayStates(
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
          log("DailyScreen -> _refreshData -> getGoals: " + error);
        });
      }
    ).catch((error) => {
      log("DailyScreen -> _refreshData -> getUser: " + error);
    });
  }

  _handleDelete(goalId: string) {
    const user:?User = this.state.user;
    if (user == null) {
      log("Error in _handleDelete: this.state.user is null/undefined.");
      return;
    }

    // Could this be called before we have data?
    if (this.state.dataLoaded) {
      GoalService.deleteGoal(
        user.getId(),
        goalId,
        (goals: GoalList) => {
          this._refreshData();
        }
      ).catch((error) => {
        log(error);
      });
    }
    return true;
  }

  _handleComplete(goalId: string) {
    const user:?User = this.state.user;
    if (user == null) {
      log("Error in _handleComplete: this.state.user is null/undefined.");
      return;
    }

    // Could this be called before we have data?
    if (this.state.dataLoaded) {
      GoalService.completeGoal(
        user.getId(),
        goalId,
        (goals: GoalList) => {
          this._refreshData();
        }
      ).catch((error) => {
        log(error);
      });
    }
    return true;
  }

  _closeDrawer() {
    if (this.drawerOpen && this.swipeable) {
      this.swipeable.recenter();
      this.drawerOpen = false;
    }
  }

  _renderGoalsView(goals: Array<Goal>): Node {
    return goals.map((g: Goal, index: number) => {
        return (
          <Swipeable
            leftButtonWidth={50}
            key={index}
            rightActionActivationDistance={25}
            leftButtons={[
              <DeleteButton onPress={() => {
                Alert.alert(
                  Localized('Daily.deleteTitle'),
                  Localized('Daily.deleteText'),
                  [
                    {
                      text: Localized('Daily.deleteCancel'),
                      style: 'cancel',
                      onPress: () => {
                        this._closeDrawer();
                      }
                    },
                    {
                      text: Localized('Daily.deleteDelete'),
                      onPress: () => {
                        this._closeDrawer();
                        this._handleDelete(g.getId());
                      }
                    },
                  ],
                  { cancelable: false }
                )
              }} />,
              <CompleteButton onPress={() => {
                Alert.alert(
                  Localized('Daily.completeTitle'),
                  Localized('Daily.completeText'),
                  [
                    {
                      text: Localized('Daily.completeCancel'),
                      style: 'cancel',
                      onPress: () => {
                        this._closeDrawer();
                      }
                    },
                    {
                      text: Localized('Daily.completeComplete'),
                      onPress: () => {
                        this._closeDrawer();
                        this._handleComplete(g.getId());
                      }
                    },
                  ],
                  { cancelable: false }
                )
              }} />,
            ]}
            onSwipeStart={() => {
              this._closeDrawer();
              this.setState({isSwiping: true});
            }}
            onSwipeRelease={() => {
              this.setState({isSwiping: false});
            }}
            onLeftButtonsOpenComplete={(event, gestureState, ref) => {
              this.drawerOpen = true;
              this.drawerOpenIndex = index;
              this.swipeable = ref;
            }}
            onLeftButtonsCloseComplete={() => {
              this.drawerOpen = false;
            }}
            >
            <GoalRow
              onTouch={() => this._closeDrawer()}
              disabled={((this.drawerOpen && (this.drawerOpenIndex == index)) ? true : false)}
              label={g.getText()}
              goalId={g.getId()}
              userId={(this.state.user == null? "" : this.state.user.getId())}
              state={g.getStateValue()} />
          </Swipeable>
        );
      });
  }

  _renderGoalsPadding() {
    return (
      <View style={styles.goalsPaddingView}>
      </View>);
  }

  _renderInstructions(goals: Array<Goal>) {
    if (goals.filter((g: Goal) => !g.getComplete()).length == 0) {
      return (
        <View style={GlobalStyles.noGoalsInstructions}>
          <Text style={[GlobalStyles.instructions, GlobalStyles.titleFontSize]}>
            {Localized('Daily.instructions')}
          </Text>
        </View>);
    }
  }

  render() {
    if (!this.state.dataLoaded || this.state.goals == null)
      return (
        <LoadingSpinner modal={false} />
      );
    const goals:Array<Goal> = this.state.goals.getGoals();

    return (
      <View style={styles.goalsView}>
        { this._renderInstructions(goals) }
        <ScrollView
          scrollEnabled={!this.state.isSwiping}
        >
        { this._renderGoalsView(goals) }
        { this._renderGoalsPadding() }
        </ScrollView>
        <AddButton style={styles.addButtonFloat} onPress={() => {
          this.props.navigation.navigate('Goal');
        }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  goalsPaddingView: {
    height: 85, // Match height of AddButton.
  },
  goalsView: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  },
  addButtonFloat: {
    position: 'absolute',
    zIndex: 100,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  },
});
