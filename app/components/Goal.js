/**
 * A Goal component.  Handles multiple interaction types.
 *
 * @author Steve Martin
 *
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

// Buttons for Yes and No
function IconButton(
  {
    type
  }: {
    type: string,
  }) {
  return (
    <TouchableOpacity
      style={styles.goalIcon}>
        <Icon
          name={'computer'}
          size={30}
          style={() => {type == 'yes' ? styles.goalYesIconOff : styles.goalNoIconOff}}
        />
    </TouchableOpacity>
  );
}

// Exported Goal component.
export default function Goal(
  {
    label,
  }: {
    label: string,
  }) {
  return (
    <TouchableOpacity style={styles.goalRow}>
      <Text style={styles.goalText}>{label}</Text>
      <IconButton type="yes"/>
      <IconButton type="no"/>
    </TouchableOpacity>
  );
}

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
