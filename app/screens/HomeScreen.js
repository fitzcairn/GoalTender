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


// TODO: understand "type Props"??
type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// Opening Screen
export default class HomeScreen extends Component<Props> {
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
          onPress={() => this.props.navigation.navigate('Settings')}
        />
      </View>
    );
  }
}
