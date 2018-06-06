/**
 * GoalTender
 * A simple react native application to take this framework for a spin.
 * Steve Martin
 * steve@stevezero.com
 *
 * @flow
 */



// TODO: remove from prod.
import './ReactotronConfig.js';



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

// Screens
import FTUXScreen from './app/screens/FTUXScreen.js';
import SettingsScreen from './app/screens/SettingsScreen.js';
import DailyScreen from './app/screens/DailyScreen.js';
import StatsScreen from './app/screens/StatsScreen.js';
import GoalScreen from './app/screens/GoalScreen.js';
import TestDataScreen from './app/screens/TestDataScreen.js';

// Services
import UserService from './app/services/UserService.js';
import { User } from './app/storage/data/User.js';

// Components
import CustomHeaderTitle from './app/components/CustomHeaderTitle.js';
import IconButton from './app/components/IconButton.js';
import LoadingSpinner from './app/components/LoadingSpinner.js';

import { nowDateDisplay } from './app/Dates.js';


// Set up Goaltender's screens.
const GoalTenderStack = {
  FTUX: {
    screen: FTUXScreen,
    path: 'ftux',
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  Settings: {
    screen: SettingsScreen,
    path: 'settings',
    navigationOptions: ({ navigation }) => ({
      title: 'Settings',
    }),
  },
  Goal: {
    screen: GoalScreen,
    path: 'goal',
    navigationOptions: ({ navigation }) => ({
      title: 'Create New Goal',
    }),
  },
  Daily: {
    screen: DailyScreen,
    path: 'daily',
    navigationOptions: ({ navigation }) => ({
      headerTitle: <CustomHeaderTitle
                     title={"Today's Goals"}
                     subtitle={nowDateDisplay()} />,
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
      },
      headerLeft: (
        <IconButton
          align='left'
          icon='settings'
          onPress={() => navigation.navigate('Settings')}
        />
      ),
      headerRight: (
        <IconButton
          align='right'
          icon='assessment'
          onPress={() => navigation.navigate('Stats')}
        />
      )
    }),
  },
  Stats: {
    screen: StatsScreen,
    path: 'stats',
    navigationOptions: ({ navigation }) => ({
      title: 'Goal Progress',
    }),
  },
  Test: {
    screen: TestDataScreen,
  },
};

// Two versions of the app navigation: with and without FTUX.
// Messy, but the best way I found to get this to work.
const GoalTender = createStackNavigator(GoalTenderStack,
{
  initialRouteName: 'FTUX',
});
const GoalTenderNoFTUX = createStackNavigator(GoalTenderStack,
{
  //initialRouteName: 'Test',
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
    UserService.getUser(
      null, // TODO: Split out a function for local storage until user signin.
      (user: User) => {
        this.setState({
          dataLoaded: true,
          showFTUX: user.getHasSeenFTUX(),
        });
      }
    )
  }

  render() {
    if (!this.state.dataLoaded)
      return (
        <LoadingSpinner modal={true} />
      );
    if (this.state.showFTUX)
      return <GoalTenderNoFTUX />;
    return <GoalTender />;
  }
}
