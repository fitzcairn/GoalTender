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

// Buttons for Yes and No
function IconButton(
  {
    type,
    disabled,
    state
  }: {
    type: string,
    disabled: boolean,
    state: string,
  }) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.goalIcon}>
        <Icon
          name={(type == 'yes' ? 'check-circle' : 'do-not-disturb')}
          size={30}
          style={(type == 'yes' ?
            (state == 'on' ? styles.goalYesIconOn : styles.goalYesIconOff) :
            (state == 'on' ? styles.goalNoIconOn : styles.goalNoIconOff))}
        />
    </TouchableOpacity>
  );
}

type Props = {
  label: string,
  id: string,
  disabled: boolean
};

type State = {
  goalState: string,
};

// Exported Goal component.
export default class GoalRow extends Component<Props, State> {
  render() {
    return (
      <View style={styles.goalRow}>
        <Text style={styles.goalText}>{this.props.label}</Text>
        <IconButton disabled={this.props.disabled} type="yes" state="on"/>
        <IconButton disabled={this.props.disabled} type="no" state="on"/>
      </View>
    );
  }
};

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
  goalYesIconOff: {
    backgroundColor: 'transparent',
    color: 'gray',
  },
  goalYesIconOn: {
    backgroundColor: 'transparent',
    color: 'green',
  },
  goalNoIconOff: {
    backgroundColor: 'transparent',
    color: 'gray',
  },
  goalNoIconOn: {
    backgroundColor: 'transparent',
    color: 'red',
  },
});
