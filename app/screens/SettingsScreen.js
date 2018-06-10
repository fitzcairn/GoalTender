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

import Localized from '../Strings';

import GlobalStyles from '../Styles.js';

import SettingsButton from '../components/SettingsButton.js';
import ExportComponent from '../components/ExportComponent.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  renderExport: boolean,
};

// App Settings
export default class SettingsScreen extends Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      renderExport: false,
    };
  }

  _maybeRenderExport() {
    if (this.state.renderExport)
      return (
        <ExportComponent onFinish={() => {
          this.setState({ renderExport: false, });
        }} />
      );
    return null;
  }

  render() {
    return (
      <View>
        { this._maybeRenderExport() }
        <ScrollView>
          <View style={GlobalStyles.settingsGroup}>
            <SettingsButton
              label={Localized('Settings.exportSetting')}
              onPress={ () => this.setState({ renderExport: true }) }
            />
            { /* TODO: Once login and server-side persist is in place, allow
              users to manage their online identity.

            <SettingsButton
              label={Localized('Settings.loginSetting')}
              disabled={true}
              onPress={() => {}}
            />

            */}
            <SettingsButton
              label={Localized('Settings.aboutSetting')}
              isLast={true}
              onPress={() => {}}
            />
          </View>
          {/* TODO: Implement local notifications, and allow folks to set
            reminders for themnselves to update their daily goals.

          <View style={GlobalStyles.settingsGroup}>
            <View style={GlobalStyles.settingsRow}>
              <View style={GlobalStyles.settingsRowViewLast}>
                <Text style={GlobalStyles.settingsTextDisabled}>
                  {Localized('Settings.remindersSetting')}
                </Text>
                <Switch disabled={true}/>
              </View>
            </View>
          </View>

          */}
        </ScrollView>
      </View>
    );
  }
}
