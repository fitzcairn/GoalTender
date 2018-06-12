/**
 * A Goal component.  Handles multiple interaction types.
 *
 * @author Steve Martin
 *
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import GoalService from '../services/GoalService.js';

import { StateValues } from '../storage/data/State.js'

import GlobalStyles from '../Styles.js';


// Buttons for Yes and No
function IconButton(
  {
    disabled,
    type,
    state,
    onPress,
  }: {
    disabled: boolean,
    type: number,
    state: number,
    onPress: () => void,
  }) {

  let style = styles.goalIconOff;
  switch(state) {
    case StateValues.YES:
      if (type == GoalRow.ButtonType.YES) style = styles.goalYesIconOn;
      break;
    case StateValues.NO:
      if (type == GoalRow.ButtonType.NO) style = styles.goalNoIconOn;
      break;
    case StateValues.NONE:
    default:
      break;
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.goalIcon}
      onPress={onPress}>
        <Icon
          name={(type == GoalRow.ButtonType.YES ? 'check-circle' : 'do-not-disturb')}
          size={30}
          style={style}
        />
    </TouchableOpacity>
  );
}

type Props = {
  label: string,
  goalId: string,
  userId: string,
  disabled: boolean,
  state: number,
  onTouch: () => void,
};

type State = {
  goalState: number,
};

// Exported Goal component.
export default class GoalRow extends Component<Props, State> {
  static ButtonType = Object.freeze({
    NO: 0,
    YES: 1
  })

  constructor(props: Object) {
    super(props);
    this.state = {
      goalState: props.state,
    };
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    if (this.props.state !== prevProps.state) {
      this.setState({
        goalState: this.props.state,
      });
    }
  }

  _saveGoalState(state: number) {
    GoalService.setGoalState(
      this.props.userId,
      this.props.goalId,
      state,
      () => {
        this.setState({
          goalState: state,
        });
      });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => this.props.onTouch()}>
        <View style={styles.goalRow}>
          <Text style={[styles.goalText, GlobalStyles.defaultFontSize]}>{this.props.label}</Text>
          <IconButton
            type={GoalRow.ButtonType.YES}
            disabled={this.props.disabled}
            state={this.state.goalState}
            onPress={() => {
              this._saveGoalState(
                  StateValues.YES
                );
            }} />
          <IconButton
            type={GoalRow.ButtonType.NO}
            disabled={this.props.disabled}
            state={this.state.goalState}
            onPress={() => {
              this._saveGoalState(
                  StateValues.NO
                );
            }} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
};

// Local styles.
const styles = StyleSheet.create({
  goalRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
  },
  goalText: {
    flex: 1,
    color: 'black',
    marginLeft: 15,
    marginRight: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  goalIcon: {
    backgroundColor: 'transparent',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalIconOff: {
    backgroundColor: 'transparent',
    color: '#cccccc',
  },
  goalYesIconOn: {
    backgroundColor: 'transparent',
    color: '#006600',
  },
  goalNoIconOn: {
    backgroundColor: 'transparent',
    color: '#cc0000',
  },
});
