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
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  createStackNavigator,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import './ReactotronConfig.js';

import Localized from './app/Strings.js';

// Screens
import FTUXScreen from './app/screens/FTUXScreen.js';
import SettingsScreen from './app/screens/SettingsScreen.js';
import DailyScreen from './app/screens/DailyScreen.js';
import StatsScreen from './app/screens/StatsScreen.js';
import GoalScreen from './app/screens/GoalScreen.js';
import AboutScreen from './app/screens/AboutScreen.js';
import TestDataScreen from './app/screens/TestDataScreen.js';

// Services
import UserService from './app/services/UserService.js';
import LocalNotificationsService from './app/services/LocalNotificationsService.js';
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
      headerStyle: { height: 60 },
      headerTitle: <CustomHeaderTitle
                     title={Localized('Settings.title')}
                     subtitle={""}/>,
      headerRight: (<View></View>),
    }),
  },
  About: {
    screen: AboutScreen,
    path: 'settings',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { height: 60 },
      headerTitle: <CustomHeaderTitle
                     title={Localized('About.title')}
                     subtitle={""}/>,
      headerRight: (<View></View>),
    }),
  },
  Goal: {
    screen: GoalScreen,
    path: 'goal',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { height: 60 },
      headerTitle: <CustomHeaderTitle
                     title={Localized('Goal.title')}
                     subtitle={""}/>,
      headerRight: (<View></View>),
    }),
  },
  Daily: {
    screen: DailyScreen,
    path: 'daily',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { height: 60 },
      headerTitle: <CustomHeaderTitle
                     title={Localized('Daily.title')}
                     subtitle={nowDateDisplay()} />,
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
          onPress={() => navigation.navigate('Stats', {
            iconColor: '#000',
            handleFilter: () => {}
          })}
        />
      ),
    }),
  },
  Stats: {
    screen: StatsScreen,
    path: 'stats',
    navigationOptions: ({ navigation }) => ({
      headerStyle: { height: 60 },
      headerTitle: <CustomHeaderTitle
                     title={Localized('Stats.title')}
                     subtitle={""}/>,
      headerRight: (
        <IconButton
          align='right'
          icon='assignment-turned-in'
          iconColor={navigation.state.params.iconColor}
          onPress={() => navigation.state.params.handleFilter()}
        />
      ),
    }),
  },
  _Test: {
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
    // Register callbacks for notifications.
    LocalNotificationsService.init((notification: Object) => {
    })

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
