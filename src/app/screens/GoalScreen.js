/**
 * Screen for creating a new goal.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import Localized from '../Strings.js';

import GlobalStyles from '../Styles.js';

// Components
import LoadingSpinner from '../components/LoadingSpinner.js';

// Services
import GoalService from '../services/GoalService.js';
import UserService from '../services/UserService.js';

// Data
import { User } from '../storage/data/User.js';
import { Goal } from '../storage/data/Goal.js';

import { log } from '../Util.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  text: string,
  error: string,
  saving: boolean,
}

export default class GoalScreen extends Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      text: '',
      error: '',
      saving: false,
    };
  }

  _handleGoalSaveAndGo() {
    // Set visual queues.
    Keyboard.dismiss();
    this.setState({saving: true});

    // First get the user data, then the goals.
    UserService.getUser(
      null, // No user ID yet, just use local.
      (user: User) => {
        // Great, we have a user, now kick off the goal write.
        GoalService.addGoal(
          user.getId(),
          this.state.text,
          (goal: Goal) => {
            // Success!  Navigate back to goals.
            this.props.navigation.navigate('Daily', { refresh: true });
          }
        );
      }
    ).catch((error) => {
      log(error);
    });
  }

  _handleSave() {
    Alert.alert(
      Localized('Goal.saveTitle'),
      Localized('Goal.saveText'),
      [
        {
          text: Localized('Goal.saveCancel'),
          style: 'cancel',
        },
        {
          text: Localized('Goal.saveComplete'),
          onPress: () => this._handleGoalSaveAndGo()
        },
      ],
      { cancelable: false }
    );
  }

 _handleText(text: string) {
   this.setState({
     text: text,
     error: 200 - text.length + ' ' + Localized('Goal.charactersRemaining'),
   });
 }

 _isInput() {
   return this.state.text.length > 0;
 }

  render() {
    if (this.state.saving) {
      // Render a saving spinner.
      return (
        <View style={styles.goalView}>
          <LoadingSpinner modal={false} text={Localized('Goal.saving')} />
        </View>
      );
    }
    // Otherwise, normal form.
    return (
      <View style={styles.goalView}>
        <Text style={[GlobalStyles.error, GlobalStyles.defaultFontSize]}>
          {this.state.error}
        </Text>
        <View style={styles.goalViewInput}>
          <TextInput
            style={[styles.goalInput, GlobalStyles.titleFontSize]}
            maxLength = {200}
            multiline = {true}
            numberOfLines = {5}
            underlineColorAndroid = {'transparent'}
            placeholder={"\n" + Localized('Goal.input') + "\n"}
            onChangeText={(text) => this._handleText(text)}
          />
        </View>
        <TouchableOpacity
          disabled={(this._isInput() ? false : true)}
          style={(this._isInput() ?
            GlobalStyles.button :
            GlobalStyles.buttonDisabled)}
          onPress={() => {this._handleSave();}}>
          <Text style={[GlobalStyles.buttonText, GlobalStyles.titleFontSize]}>
            {Localized('Goal.saveButton')}
          </Text>
        </TouchableOpacity>
        <View style={styles.goalViewSpacer}>
        </View>
      </View>
    );
  }
}

// Styles only used on this screen.
const styles = StyleSheet.create({
  goalViewSpacer: {
    flex: 1,
  },
  goalView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  goalViewInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderColor: 'gray',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  goalInput: {
    flex: 1,
    backgroundColor: 'white',
    alignSelf:'center',
    textAlignVertical: 'top',
    textAlign: 'center',
  },
});
