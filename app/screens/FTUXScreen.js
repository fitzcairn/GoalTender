/**
 * Home screen for GoalTender
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
  Image
} from 'react-native';
import {
  createStackNavigator,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import styles from '../Styles.js';
import FTUXService from '../services/FTUXService.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
   showFTUX: string,
 };

// Opening Screen
export default class FTUXScreen extends Component<Props, State> {
  // Hide the top navigation tab.
  static navigationOptions = { header: null };

  // Helper function to write FTUX state and then navigate.
  saveAndNavigate() {
    FTUXService.setFTUX();
    this.props.navigation.navigate('Settings');
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
