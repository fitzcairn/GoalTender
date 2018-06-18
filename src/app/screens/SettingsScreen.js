/**
 * Settings screen for GoalTender.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import DateTimePicker from 'react-native-modal-datetime-picker';

import SettingsButton from '../components/SettingsButton.js';
import ExportComponent from '../components/ExportComponent.js';

import UserService from '../services/UserService.js';

import { User } from '../storage/data/User.js'

import { nowDateTime, fromIsoToDisplay, getHoursMinutes } from '../Dates.js';

import { log } from '../Util.js';

import Localized from '../Strings.js';

import GlobalStyles from '../Styles.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  renderExport: boolean,
  showPicker: boolean,
  notificationsOn: boolean,
  notificationsIsoTime: string,
  user: User|null,
};

// App Settings
export default class SettingsScreen extends Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      renderExport: false,
      showPicker: false,
      notificationsOn: false,
      notificationsIsoTime: nowDateTime(),
      user: null,
    };
  }

  componentDidMount() {
    let isoTime:string = this.state.notificationsIsoTime;

    // Get the user.
    UserService.getUser(
      null, // No userID until we integrate login.
      (user: User) => {
        // $FlowFixMe
        if (user.getReminderTime() != null) isoTime = user.getReminderTime();

        this.setState({
          user: user,
          notificationsOn: user.getRemindersOn(),
          notificationsIsoTime: isoTime,
        });
      }
    ).catch((error) => {
      log("SettingsScreen -> componentDidMount: " + error);
    });
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

  _updateUserReminderState(notificationsOn: boolean, isoTime: string) {
    UserService.updateUserReminder(
      this.state.user == null ? null : this.state.user.getId(),
      notificationsOn,
      isoTime,
      (updatedUser: User) => {

        // TODO: If notofications are on, use library to create:
        // https://github.com/wmcmahan/react-native-calendar-reminders

        if (!notificationsOn) {
          // Disable calendar entry.
        } else {
          // Enable calendar entry.
        }

        this.setState({
          notificationsOn: notificationsOn,
          notificationsIsoTime: isoTime,
          user: updatedUser,
          showPicker: false
        });
      }).catch((error) => {
        log("SettingsScreen -> _updateUserReminderState: " + error);
      });
  }

  _handleSwitchValueChange() {
    this._updateUserReminderState(
      !this.state.notificationsOn, this.state.notificationsIsoTime);
  }

  _showTimePicker() {
    this.setState({
      showPicker: true
    });
  }

  _hideTimePicker() {
    this.setState({
      showPicker: false
    });
  }

  _handleTimePicked(isoTime: string) {
    const [hours, mins] = getHoursMinutes(isoTime);
    this._updateUserReminderState(this.state.notificationsOn, isoTime);
  }

  _getReminderTime(): string {
    if (this.state.user == null || this.state.user.getReminderTime() == null)
      return fromIsoToDisplay(this.state.notificationsIsoTime);
    // $FlowFixMe
    return fromIsoToDisplay(this.state.user.getReminderTime());
  }

  _renderReminderDateTime() {
    if (this.state.notificationsOn) {
      return (
          <TouchableOpacity
            style={GlobalStyles.settingsRow}
            onPress={ () => this._showTimePicker() }>
            <View style={GlobalStyles.reminderSettingsDateRowView}>
              <Text style={
                [GlobalStyles.settingsTextClickable, GlobalStyles.defaultFontSize]
              }>
                { this._getReminderTime() }
              </Text>
            </View>
          </TouchableOpacity>
      );
    }
    else return null;
  }

  render() {
    return (
      <View style={styles.settingsView}>
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
              onPress={() => { this.props.navigation.navigate('About'); }}
            />
          </View>
          <View style={GlobalStyles.settingsGroup}>
            <View style={GlobalStyles.settingsRow}>
              <View style={GlobalStyles.reminderSettingsToggleRowView}>
                <Text style={[GlobalStyles.settingsText, GlobalStyles.defaultFontSize]}>
                  {Localized('Settings.remindersSetting')}
                </Text>
                <Switch
                  value={ this.state.notificationsOn }
                  onValueChange={() => this._handleSwitchValueChange()}
                />
              </View>
            </View>
            { this._renderReminderDateTime() }
            <DateTimePicker
              mode={"time"}
              minuteInterval={5}
              isVisible={this.state.showPicker}
              onConfirm={(time) => this._handleTimePicked(time)}
              onCancel={() => this._hideTimePicker()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settingsView: {
    flex: 1,
  },
});
