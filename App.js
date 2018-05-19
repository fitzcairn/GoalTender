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

import HomeScreen from './app/screens/HomeScreen.js';
import SettingsScreen from './app/screens/SettingsScreen.js';
import DailyScreen from './app/screens/DailyScreen.js';
import StatsScreen from './app/screens/StatsScreen.js';

// Set up Goaltender's screens.
const GoalTender = createStackNavigator({
  Home: {
    screen: HomeScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'home',
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
},
{
  initialRouteName: 'Home',
});

// The main app class.
export default class App extends Component<Props> {
  render() {
    return <GoalTender />;
  }
}
