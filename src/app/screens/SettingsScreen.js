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
  notificationsOn: boolean,
  showPicker: boolean,
  isoTime: string,
  user: User|null,
};

// App Settings
export default class SettingsScreen extends Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      renderExport: false,
      notificationsOn: false,
      showPicker: false,
      isoTime: nowDateTime(),
      user: null,
    };
  }

  componentDidMount() {
    // Get the user.
    UserService.getUser(
      null, // No userID until we integrate login.
      (user: User) => {
        this.setState({
          user: user,
        });
      }
    ).catch((error) => {
      log("DailyScreen -> _refreshData -> getGoals: " + error);
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

  _handleSwitchValueChange() {
    this.setState({
      notificationsOn: !this.state.notificationsOn,
    });
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

  _handleTimePicked(time: string) {
    const [hours, mins] = getHoursMinutes(time);
    const user = this.state.user;
    if (user == null) {
      this.setState({
        isoTime: time,
        showPicker: false
      });
    } else {
      UserService.updateUserReminderTime(
        user.getId(),
        time,
        (updatedUser: User) => {
          this.setState({
            isoTime: time,
            user: updatedUser,
            showPicker: false
          });
        })
    }
  }

  _getReminderTime(): string {
    if (this.state.user == null || this.state.user.getReminderTime() == null)
      return fromIsoToDisplay(this.state.isoTime);
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
