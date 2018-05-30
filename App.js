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
  TextInput,
  View,
  Button,
  Image
} from 'react-native';

import {
  createStackNavigator,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import FTUXScreen from './app/screens/FTUXScreen.js';
import SettingsScreen from './app/screens/SettingsScreen.js';
import DailyScreen from './app/screens/DailyScreen.js';
import StatsScreen from './app/screens/StatsScreen.js';

import FTUXService from './app/services/FTUXService.js';

import styles from './app/Styles.js';


// Set up Goaltender's screens.
const GoalTenderStack = {
  FTUX: {
    screen: FTUXScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'ftux',
    // Optional: Override the `navigationOptions` for the screen
    //navigationOptions: ({ navigation }) => ({
    //  title: `${navigation.state.params.name}'s Profile'`,
    //}),
  },
  Settings: {
    screen: SettingsScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'settings',
    // Optional: Override the `navigationOptions` for the screen
    //navigationOptions: ({ navigation }) => ({
    //  title: `${navigation.state.params.name}'s Profile'`,
    //}),
  },
  Daily: {
    screen: DailyScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'daily',
    // Optional: Override the `navigationOptions` for the screen
    //navigationOptions: ({ navigation }) => ({
    //  title: `${navigation.state.params.name}'s Profile'`,
    //}),
  },
  Stats: {
    screen: StatsScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'stats',
    // Optional: Override the `navigationOptions` for the screen
    //navigationOptions: ({ navigation }) => ({
    //  title: `${navigation.state.params.name}'s Profile'`,
    //}),
  }
};

// Two versions of the app navigation: with and without FTUX.
// Messy, but the best way I found to get this to work.
const GoalTender = createStackNavigator(GoalTenderStack,
{
  initialRouteName: 'FTUX',
});
const GoalTenderNoFTUX = createStackNavigator(GoalTenderStack,
{
  initialRouteName: 'Daily',
});


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  dataLoaded: boolean,
  showFTUX: boolean,
};

// The main app class.
export default class App extends Component<Props, State> {
  constructor(props: Object) {
    super(props);
    this.state = {
      dataLoaded: false,
      showFTUX: false
    };
  }

  componentDidMount() {
    FTUXService.hasFTUX((value: boolean) => {
        this.setState({ dataLoaded: true, showFTUX: value});
      }
    );
  }

  render() {
    if (!this.state.dataLoaded)
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Loading...
          </Text>
        </View>
        );
    if (this.state.showFTUX)
      return <GoalTenderNoFTUX />;
    return <GoalTender />;
  }
}
