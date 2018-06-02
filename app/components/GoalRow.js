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
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { GoalStateValues } from '../services/StatesService.js';


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
    case GoalStateValues.YES:
      if (type == GoalRow.ButtonType.YES) style = styles.goalYesIconOn;
      break;
    case GoalStateValues.NO:
      if (type == GoalRow.ButtonType.NO) style = styles.goalNoIconOn;
      break;
    case GoalStateValues.NONE:
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
  id: string,
  disabled: boolean,
  state: number,
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

  _saveGoalState(state: number) {
    console.log("Goal id: " + this.props.id +
      " transitioning from " + this.state.goalState +
      " to: " + state);
    this.setState({
      goalState: state,
    })
  }

  render() {
    return (
      <View style={styles.goalRow}>
        <Text style={styles.goalText}>{this.props.label}</Text>
        <IconButton
          type={GoalRow.ButtonType.YES}
          disabled={this.props.disabled}
          state={this.state.goalState}
          onPress={() => {
            this._saveGoalState(
                GoalStateValues.YES
              );
          }} />
        <IconButton
          type={GoalRow.ButtonType.NO}
          disabled={this.props.disabled}
          state={this.state.goalState}
          onPress={() => {
            this._saveGoalState(
                GoalStateValues.NO
              );
          }} />
      </View>
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
    marginBottom: 1,
  },
  goalText: {
    flex: 1,
    color: 'black',
    marginLeft: 14,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8,
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
