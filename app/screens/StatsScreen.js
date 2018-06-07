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

import LoadingSpinner from '../components/LoadingSpinner.js';

import GoalService from '../services/GoalService.js';
import UserService from '../services/UserService.js';

import { User } from '../storage/data/User.js';
import { Goal, GoalList } from '../storage/data/Goal.js';
import { StateValues } from '../storage/data/State.js';

import { nowDate, dateDisplay, getWeekdays, getDaysBetween } from '../Dates.js';

import GlobalStyles from '../Styles.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  dataLoaded: boolean,
  user: User | null,
  goalStates: Map<string, Map<string, State>>,
  goals: GoalList | null,
  lastIndex: number,
};

// Stats Screen
export default class StatsScreen extends Component<Props, State> {
  constructor(props: Object) {
    super(props);
    this.state = {
      dataLoaded: false,
      user: null,
      goals: null,
      goalStates: new Map(),
      lastIndex: -1,
    };
  }

  componentDidMount() {
    this._refreshData();
  }

  _refreshData() {
    // First get the user data, then the goals.
    UserService.getUser(
      null, // No userID until we integrate login.
      (user: User) => {
        // Great, we have a user, now kick off the goals fetch.
        // We don't set state first because there is nothing to redraw yet.
        GoalService.getGoals(
          user.getId(),
          (goals: GoalList) => {

            // Success!  Set state and trigger refresh.
            this.setState({
              dataLoaded: true,
              user: user,
              goals: goals,
            });

            // Load state for first screen in swiper.
            this._loadStatesFor(0);
          }
        ).catch((error) => {
          console.log("StatsScreen -> _refreshData -> getGoals: " + error);
        });
      }
    ).catch((error) => {
      console.log("StatsScreen -> _refreshData -> getUser: " + error);
    });
  }

  _loadStatesFor(index: number) {
    if (!this.state.dataLoaded) return;
    const goals:Array<Goal> = this.state.goals.getGoals();
    if (goals.length <= 0) return;
    const goal:Goal = goals[index];

    // Load the state for the first goal.
    GoalService.getStatesFor(
      this.state.user.getId(),
      goal.getId(),
      (stateMap: Map<string, State>) => {
        this.state.goalStates.set(goal.getId(), stateMap);

        // Success!  Set state and trigger refresh.
        this.setState({
          dataLoaded: true,
          lastIndex: index,
        });
      }
    ).catch((error) => {
      console.log("StatsScreen -> _loadStatesFor: " + error);
    });
  }

  _renderWeekDays(): Node {
    const weekdays:Array<string> = getWeekdays();
    const rendered:Array<Object> = weekdays.map((day: string) => {
      return (
          <Text key={day} style={styles.calendarWeekdaysText}>
            {day.toUpperCase()}
          </Text>
      );
    });
    return rendered;
  }

  _renderDays(days: Array<string>, dateMap: Map<string, State>): Node {
    console.log(dateMap);
    return days.map((day: string, index: number) => {
      return (
        <View key={index} style={
          (dateMap.has(day[0]) ?
            (dateMap.get(day[0]).getState() == StateValues.NO ?
              styles.dayNo : styles.dayYes) :
            styles.dayNone
          )}>
          <Text style={
            (dateMap.has(day[0]) ? styles.dayTextColor : styles.dayText)
          }>
            {day[1]}
          </Text>
        </View>
      );
    });
  }

  _renderWeeks(goal: Goal): Node {
    if (!this.state.goalStates.has(goal.getId()))
      return (
        <View style={GlobalStyles.container}>
          <LoadingSpinner modal={false} />
        </View>
      );

    // Get days between the first and last date we have data.
    const dateMap:Map<string, State> = this.state.goalStates.get(goal.getId());
    const dateList = Array.from(dateMap.keys());
    const days:Array<Array<string>> = getDaysBetween(dateList[0],
      dateList[dateList.length - 1]);

    // Create weeks.
    const weeks:Array<Array<Array<string>>> = [];
    for (let day = 0; day < days.length; day += 7)
      weeks.push(days.slice(day, day + 7));

    // Render grid.
    return weeks.map((week: Array<Array<string>>, index: number) => {
      return (
          <View key={index} style={styles.week}>
          { this._renderDays(weeks[index], dateMap) }
          </View>
      );
    });
  }

  _renderGoals(): Node {
    const goals:Array<Goal> = this.state.goals.getGoals();
    if (goals.length == 0) {
      return (
        <View style={GlobalStyles.noGoalsInstructions}>
          <Text style={GlobalStyles.instructions}>
            Create goals to start tracking your progress here.
          </Text>
        </View>);
    }
    return goals.map((goal: Goal) => {
      return (
        <View>
          <View style={styles.header}>
            <View style={styles.headerItem}>
              <Text style={styles.goalText}>
                {goal.getText()}
              </Text>
              <Text style={styles.dateText}>
                Created {dateDisplay(goal.getCreateDate())}
              </Text>
            </View>
          </View>
          <View style={styles.calendarWeekdays}>
              { this._renderWeekDays() }
          </View>
          <ScrollView>
            { this._renderWeeks(goal) }
          </ScrollView>
        </View>
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
        onIndexChanged={(index) => { this._loadStatesFor(index) }}
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
  week: {
    flexDirection: 'row',
  },
  dayNone: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 12,
    paddingBottom: 12,
    margin: 1
  },
  dayNo: {
    flex: 1,
    backgroundColor: '#cc0000',
    paddingTop: 12,
    paddingBottom: 12,
    margin: 1,
  },
  dayYes: {
    flex: 1,
    backgroundColor: '#006600',
    paddingTop: 12,
    paddingBottom: 12,
    margin: 1,
  },
  dayText: {
    flex: 1,
    textAlign: 'center',
    color: '#595959',
    fontSize: 12
  },
  dayTextColor: {
    flex: 1,
    textAlign: 'center',
    color: '#f2f2f2',
    fontSize: 12
  },
  calendarWeekdays: {
    flexDirection: 'row',
  },
  calendarWeekdaysText: {
    flex: 1,
    color: '#808080',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    padding: 10
  },
  headerItem: {
    flex: 1,
    alignItems: 'center',
  },
  goalText: {
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? 16 : 18,
    color: 'rgba(0, 0, 0, .9)',
    marginHorizontal: 16,
  },
  dateText: {
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? 10 : 12,
    color: 'grey'
  },
  dayScrollView: {
    alignSelf: 'center',
    marginTop: 100,
  },
});
