/**
 * Settings screen for GoalTender.
 *
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
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

// TODO: Add DateTimePicker once I tackle local notifications.
// https://github.com/mmazzarolo/react-native-modal-datetime-picker
//import DateTimePicker from 'react-native-modal-datetime-picker';

import GlobalStyles from '../Styles.js';

import SettingsButton from '../components/SettingsButton.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// App Settings
export default class SettingsScreen extends Component<Props> {
  render() {
    return (
      <ScrollView>
        <View style={GlobalStyles.settingsGroup}>
          <SettingsButton
            label='Manage Identity'
            onPress={() => alert("TBD")} />
          <SettingsButton
            label='Export Data'
            onPress={() => alert("TBD")} />
          <SettingsButton
            label='About'
            isLast={true}
            onPress={() => alert("TBD")} />
        </View>
        <View style={GlobalStyles.settingsGroup}>
          <View style={GlobalStyles.settingsRow}>
            <View style={GlobalStyles.settingsRowViewLast}>
              <Text style={GlobalStyles.settingsText}>Enable Reminders</Text>
              <Switch />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
