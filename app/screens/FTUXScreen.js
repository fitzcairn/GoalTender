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
  Button,
} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import styles from '../Styles.js';
import FTUXService from '../services/FTUXService.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// Opening Screen
export default class FTUXScreen extends Component<Props> {

  // Helper function to write FTUX state and then navigate.
  saveAndNavigate() {
    FTUXService.setFTUX();
    this.props.navigation.navigate('Daily');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to GoalTender!
        </Text>
        <Text style={styles.instructions}>
          This is a tiny app to help you track simple daily goals.
        </Text>
        <Button
          title="Get Started!"
          onPress={() => this.saveAndNavigate()}
        />
      </View>
    );
  }
}
