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
  Button,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import LoadingSpinner from '../components/LoadingSpinner.js';

import GoalService from '../services/GoalService.js';
import UserService from '../services/UserService.js';

import { User } from '../storage/data/User.js';
import { Goal, GoalList } from '../storage/data/Goal.js';
import { StateValues } from '../storage/data/State.js';

import { nowDate, getWeekdays, getDaysBetween } from '../Dates.js';


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

  _renderWeekDays(): Array<Object> {
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

  _renderDays(days: Array<string>): Array<Object> {
    return days.map((day: string, index: number) => {
      return (
        <View key={index} style={styles.day}>
          <Text style={styles.dayText}>{day}</Text>
        </View>
      );
    });
  }

  _renderWeeks(): Array<Object> {
    const days:Array<string> = getDaysBetween('2018-03-01', nowDate());
    console.log(days);

    // Create weeks.
    const weeks:Array<Array<string>> = [];
    for (let day = 0; day < days.length; day += 7)
      weeks.push(days.slice(day, day + 7));

    console.log(weeks);

    return weeks.map((week: Array<string>, index: number) => {
      return (
          <View key={index} style={styles.week}>
          { this._renderDays(weeks[index]) }
          </View>
      );
    });
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <View style={styles.headerItem}>
              <Text style={styles.goalText}>Goal Name</Text>
              <Text style={styles.dateText}>Goal Set X/Y/Z</Text>
          </View>
        </View>
        <View style={styles.calendarWeekdays}>
            { this._renderWeekDays() }
        </View>
        <ScrollView>
          { this._renderWeeks() }
        </ScrollView>
      </View>
    );
  }
}

// Local styles.
const styles = StyleSheet.create({
  week: {
    flexDirection: 'row',
  },
  day: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 12,
    paddingBottom: 12,
    margin: 1
  },
  dayText: {
    flex: 1,
    textAlign: 'center',
    color: '#A9A9A9',
    fontSize: 12
  },
  calendarWeekdays: {
    flexDirection: 'row',
    backgroundColor: "red",
  },
  calendarWeekdaysText: {
    flex: 1,
    color: '#C0C0C0',
    textAlign: 'center'
  },
  header: {
    backgroundColor: '#329BCB',
    flexDirection: 'row',
    padding: 10
  },
  headerItem: {
    flex: 1
  },
  goalText: {
    textAlign: 'left',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  dateText: {
    textAlign: 'left',
    color: '#fff',
    fontSize: 14,
  },
});
