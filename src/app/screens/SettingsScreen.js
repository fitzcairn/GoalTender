/**
 * Settings screen for GoalTender.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  Linking,
  Platform,
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import Notifications from 'react-native-push-notification';

import SettingsButton from '../components/SettingsButton.js';
import ExportComponent from '../components/ExportComponent.js';

import UserService from '../services/UserService.js';
import LocalNotificationsService from '../services/LocalNotificationsService.js';

import { User } from '../storage/data/User.js'

import { nowDateTime, fromIsoToDisplay, getNextTime } from '../Dates.js';

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
  showiOSNotificationsLink: boolean,
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
      showiOSNotificationsLink: false,
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

        this._updateComponentState(
          false, user.getRemindersOn(), user, isoTime);
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

  _updateComponentState(
    showiOSNotificationsLink: boolean,
    notificationsOn: boolean,
    updatedUser: User,
    isoTime: string) {

    if (!notificationsOn)
      LocalNotificationsService.clearReminderNotifications();

    this.setState({
      notificationsOn: notificationsOn,
      user: updatedUser,
      showPicker: false,
      showiOSNotificationsLink: showiOSNotificationsLink,
      notificationsIsoTime: isoTime,
    });
  }

  _updateUserState(
    showiOSNotificationsLink: boolean,
    notificationsOn: boolean,
    isoTime: ?string) {

    let checkedIsoTime = this.state.notificationsIsoTime;
    if (isoTime != null) checkedIsoTime = isoTime;

    UserService.updateUserReminder(
      this.state.user == null ? null : this.state.user.getId(),
      notificationsOn,
      checkedIsoTime,
      (updatedUser: User) => {
        // Now update the component.
        this._updateComponentState(
          showiOSNotificationsLink,
          notificationsOn,
          updatedUser,
          checkedIsoTime);
      }
    ).catch((error) => {
      log("SettingsScreen -> _updateUserState: " + error);
    });
  }

  _updateUserAndComponentState(
    notificationsOn: boolean,
    isoTime: string) {

    // Schedule notification if needed.
    if (notificationsOn) {
      LocalNotificationsService.handlePermissions(
        () => { // Success
          // We have permission.  Schedule the notification and update state.
          LocalNotificationsService.scheduleReminderNotifications(isoTime);
          this._updateUserState(
            false, // showiOSNotificationsLink
            notificationsOn,
            isoTime);
        },
        () => { // Fail
          this._updateUserState(
            true,  // showiOSNotificationsLink
            false); // notificationsOn
            // no isoTime update.
        });
    } else {
      this._updateUserState(
        false,  // showiOSNotificationsLink
        notificationsOn);
        // no isoTime update.
    }
  }

  _handleSwitchValueChange() {
    this._updateUserAndComponentState(
      !this.state.notificationsOn,
      this.state.notificationsIsoTime);
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
    // The timestring returned by the picker will be for today.
    // However, if it is for a time before now, Android will immediately pop a
    // notification.  Adjust to tomorrow if that is the case.
    this._updateUserAndComponentState(
      this.state.notificationsOn,
      getNextTime(isoTime));
  }

  _getReminderTime(): string {
    if (this.state.user == null || this.state.user.getReminderTime() == null)
      return fromIsoToDisplay(this.state.notificationsIsoTime);
    // $FlowFixMe
    return fromIsoToDisplay(this.state.user.getReminderTime());
  }

  _maybeRenderReminderDateTime() {
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
              <Icon name='chevron-right' style={GlobalStyles.settingsIcon} size={30}/>
            </View>
          </TouchableOpacity>
      );
    }
    else if (this.state.showiOSNotificationsLink && Platform.OS =='ios') {
        return (
            <TouchableOpacity
              style={GlobalStyles.settingsRow}
              onPress={ () => Linking.openURL('app-settings:') }>
              <View style={GlobalStyles.reminderSettingsDateRowView}>
                <Text style={
                  [GlobalStyles.settingsTextClickable, GlobalStyles.defaultFontSize]
                }>
                  { Localized('Settings.remindersiOSSettings') }
                </Text>
                <Icon name='chevron-right' style={GlobalStyles.settingsIcon} size={30}/>
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
            { this._maybeRenderReminderDateTime() }
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
