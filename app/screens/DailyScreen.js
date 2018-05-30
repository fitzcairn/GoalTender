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
  Text,
  View,
  Button,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import styles from '../Styles.js';

// TODO: understand "type Props"??
type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// Daily Goals Screen
export default class DailyScreen extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Daily Goals Screen</Text>
      </View>
    );
  }
}
