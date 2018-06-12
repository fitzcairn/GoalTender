/**
 * FTUX screen for GoalTender
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import Localized from '../Strings.js';

import GlobalStyles from '../Styles.js';

// Services
import UserService from '../services/UserService.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// Opening Screen
export default class FTUXScreen extends Component<Props> {

  _registerUser() {
    // TODO: Call this from a login integration.  For now, no user id.
    UserService.updateUserFTUX(
      null, // No user id; just use the default local one.
      true, // User has seen FTUX.
      () => this.props.navigation.navigate('Daily'))
  }

  render() {
    return (
      <View style={GlobalStyles.container}>
        <Text style={[GlobalStyles.welcome, GlobalStyles.splashFontSize]}>
          {Localized('FTUXScreen.welcome')}
        </Text>
        <Text style={[GlobalStyles.instructions, GlobalStyles.titleFontSize]}>
          {Localized('FTUXScreen.instructions')}
        </Text>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => this._registerUser()}>
          <Text style={[GlobalStyles.buttonText, GlobalStyles.titleFontSize]}>
            {Localized('FTUXScreen.button')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
