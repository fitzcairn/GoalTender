/**
 * The historical view for a goal.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';
import type { Node } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import LoadingSpinner from '../components/LoadingSpinner.js';

import GoalService from '../services/GoalService.js';

import { State as StateForGoal, StateValues } from '../storage/data/State.js';

import { dateDisplay, getWeekdays, getDaysBetweenDisplay } from '../Dates.js';

import GlobalStyles from '../Styles.js';

import Localized from '../Strings.js';

import { log } from '../Util.js';


type Props = {
  index: number,
  userId: string,
  goalId: string,
  goalText: string,
  goalDate: string,
  goalComplete: boolean,
};

type State = {
  dataLoaded: boolean,
  goalStates: Map<string, StateForGoal>,
};

// Builds the full view for the history of one goal.
export default class GoalHistoryView extends Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      dataLoaded: false,
      goalStates: new Map(),
    };
  }

  componentDidMount() {
    this._refreshData();
  }

  _setState(stateMap: Map<string, StateForGoal>) {
    this.setState({
      goalStates: stateMap,
      dataLoaded: true,
    });
  }

  _refreshData() {
    // Load the state for the goal.
    GoalService.getStatesForGoal(
      this.props.userId,
      this.props.goalId,
      (stateMap: Map<string, StateForGoal>) => this._setState(stateMap)
    ).catch((error) => {
      log("StatsScreen -> _loadStatesFor: " + error);
    });
  }

  _renderWeekDays(): Node {
    const weekdays:Array<string> = getWeekdays();
    const rendered:Array<Object> = weekdays.map((day: string) => {
      return (
          <Text key={day} style={styles.calendarWeekdaysText}>
            { day.toUpperCase() }
          </Text>
      );
    });
    return rendered;
  }

  _getDayStyle(day: string, dateMap: Map<string, StateForGoal>) {
    const state:?StateForGoal = dateMap.get(day);
    if (state == null) return styles.dayNone;
    if (state.getState() == StateValues.YES) return styles.dayYes;
    return styles.dayNo;
  }

  _renderDays(days: Array<string>, dateMap: Map<string, StateForGoal>): Node {
    return days.map((day: string, index: number) => {
      return (
        <View key={index} style={ this._getDayStyle(day[0], dateMap) }>
          <Text style={
            (dateMap.has(day[0]) ? styles.dayTextColor : styles.dayText)
          }>
            { day[1] }
          </Text>
        </View>
      );
    });
  }

  _renderWeeks(): Node {
    const dateMap:Map<string, StateForGoal> = this.state.goalStates;
    if (!this.state.dataLoaded || dateMap == null) {
      log("Data not loaded for " + this.props.goalId);
      return (
        <LoadingSpinner modal={false} />
      );
    }

    // Get days between the first and last date we have data.
    const dateList = Array.from(dateMap.keys());
    const days:Array<Array<string>> = getDaysBetweenDisplay(dateList[0],
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

  _renderGoalText() {
    if (this.props.goalComplete)
      return (
        <View style={styles.headerItem}>
          <Text style={[styles.goalCompleted, GlobalStyles.defaultFontSize]}>
            { Localized("Stats.completed") }
          </Text>
          <Text style={[styles.goalText, GlobalStyles.titleFontSize]}>
            { this.props.goalText }
          </Text>
          <Text style={[styles.dateText, GlobalStyles.defaultFontSize]}>
          { /* Note: Can't seem to get I18n.t working with params. */ }
          { Localized("Stats.created") + dateDisplay(this.props.goalDate) }
          </Text>
        </View>
      );
    return (
      <View style={styles.headerItem}>
        <Text style={[styles.goalText, GlobalStyles.titleFontSize]}>
          { this.props.goalText }
        </Text>
        <Text style={[styles.dateText, GlobalStyles.defaultFontSize]}>
          { /* Note: Can't seem to get I18n.t working with params. */ }
          { Localized("Stats.created") + dateDisplay(this.props.goalDate) }
        </Text>
      </View>
    );
  }

  _renderGoal(): Node {
      return (
        <View key={this.props.index}>
          <View style={styles.header}>
              { this._renderGoalText() }
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

  render() {
    if (!this.state.dataLoaded)
      return (
        <LoadingSpinner modal={false} />
      );
    return this._renderGoal();
  }
}

// Local styles.
const styles = StyleSheet.create({
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
    color: 'rgba(0, 0, 0, .9)',
    marginHorizontal: 16,
  },
  goalCompleted: {
    textAlign: 'center',
    color: '#006600'
  },
  dateText: {
    textAlign: 'center',
    color: 'grey'
  },
});
