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

import GlobalStyles from '../Styles.js';
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
      <View style={GlobalStyles.container}>
        <Text style={GlobalStyles.welcome}>
          Welcome to GoalTender!
        </Text>
        <Text style={GlobalStyles.instructions}>
          This is a tiny app to help you track simple daily goals.
        </Text>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => this.saveAndNavigate()}>
          <Text style={GlobalStyles.buttonText}>Get Started!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
