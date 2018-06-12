/**
 * Goal statistics screen.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';
import type { Node } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import Swiper from 'react-native-swiper';

import GoalHistoryView from '../components/GoalHistoryView.js';
import IconButton from '../components/IconButton.js';
import LoadingSpinner from '../components/LoadingSpinner.js';

import GoalService from '../services/GoalService.js';
import UserService from '../services/UserService.js';

import { User } from '../storage/data/User.js';
import { Goal, GoalList } from '../storage/data/Goal.js';
import { State as StateForGoal, StateValues } from '../storage/data/State.js';

import { dateDisplay, getWeekdays, getDaysBetweenDisplay } from '../Dates.js';

import Localized from '../Strings.js';

import GlobalStyles from '../Styles.js';

import { log } from '../Util.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  dataLoaded: boolean,
  showCompleted: boolean,
  user: User | null,
  goals: GoalList | null,
};

// Stats Screen
export default class StatsScreen extends Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      dataLoaded: false,
      showCompleted: false,
      user: null,
      goals: null,
      goalStates: new Map(),
      lastIndex: -1,
    };
  }

  componentDidMount() {
    // Tie the header button into
    this.props.navigation.setParams({ handleFilter: () => this._setShowComplete()} )
    this._refreshData();
  }

  _setShowComplete() {
    this.props.navigation.setParams({
      iconColor: '#006600',
      handleFilter: () => this._setShowAll()
    });
    this.setState({
      showCompleted: true,
      dataLoaded: false,
    });
    this._refreshData();
  }

  _setShowAll() {
    this.props.navigation.setParams({
      iconColor: '#000',
      handleFilter: () => this._setShowComplete()
    });
    this.setState({
      showCompleted: false,
      dataLoaded: false,
    });
    this._refreshData();
  }

  _refreshDataState(user: User, goals: GoalList) {
    this.setState({
      dataLoaded: true,
      user: user,
      goals: goals,
    });
  }

  _refreshData() {
    // First get the user data, then the goals.
    UserService.getUser(
      null, // No userID until we integrate login.
      (user: User) => {

        // We don't set state first because there is nothing to redraw yet.
        // If we're viewing completed goals, fetch those only.
        if (this.state.showCompleted) {
          GoalService.getCompletedGoals(
            user.getId(),
            (goals: GoalList) => this._refreshDataState(user, goals)
          ).catch((error) => {
            log("StatsScreen -> _refreshData -> getCompletedGoals: " + error);
          });
        // Otherwise, fetch the incomplete goals.
        } else {
          GoalService.getIncompleteGoals(
            user.getId(),
            (goals: GoalList) => this._refreshDataState(user, goals)
          ).catch((error) => {
            log("StatsScreen -> _refreshData -> getGoals: " + error);
          });
        }
      }
    ).catch((error) => {
      log("StatsScreen -> _refreshData -> getUser: " + error);
    });
  }

  _renderGoals(): Node {
    const userId:?string = this.state.user.getId();
    const goalList:?GoalList = this.state.goals;
    const goals:Array<Goal> = (goalList == null? [] : goalList.getGoals());

    if (goals.length == 0)
      return (
        <View style={GlobalStyles.noGoalsInstructions}>
          <Text style={GlobalStyles.instructions}>
           { this.state.showCompleted ?
             Localized('Stats.noCompleted') :
             Localized('Stats.instructions') }
          </Text>
        </View>
      );

    return goals.map((goal: Goal, index: number) => {
      return (
        <GoalHistoryView
          key={index}
          index={index}
          userId={userId}
          goalId={goal.getId()}
          goalText={goal.getText()}
          goalDate={goal.getCreateDate()}
          goalComplete={goal.getComplete()}
        />
      );
    });
  }

  render() {
    if (!this.state.dataLoaded)
      return (
        <LoadingSpinner modal={false} />
      );
    return (
      <Swiper style={styles.swiper}
        showsButtons={false}
        loadMinimal={true}
        showsPagination={true}
      >
        { this._renderGoals() }
      </Swiper>
    );
  }
}

// Local styles.
const styles = StyleSheet.create({
  swiper: {
  },
});
