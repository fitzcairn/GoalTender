/**
 * Settings screen for GoalTender.
 * @author Steve Martin
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
  Image,
  SectionList,
  ScrollView,
  Switch,
} from 'react-native';

import {
  createStackNavigator,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

// TODO: Add DateTimePicker once I tackle local notifications.
// https://github.com/mmazzarolo/react-native-modal-datetime-picker
//import DateTimePicker from 'react-native-modal-datetime-picker';

import styles from '../Styles.js';

import SettingsButton from '../components/SettingsButton.js';


// TODO: understand "type Props"??
type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// App Settings
export default class SettingsScreen extends Component<Props> {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.settingsGroup}>
          <SettingsButton label='Manage Identity' onPress={() => this.props.navigation.navigate('Stats')} />
          <SettingsButton label='Another Setting' onPress={() => this.props.navigation.navigate('Stats')} />
          <SettingsButton label='Oh Snap!' onPress={() => this.props.navigation.navigate('Stats')} />
        </View>
        <View style={styles.settingsGroup}>
          <View style={styles.settingsRow}>
            <Text style={styles.settingsText}>Enable Reminders</Text>
            <Switch />
          </View>
          <View style={styles.settingsRow}>
          </View>
        </View>
      </ScrollView>
    );
  }
}
