/**
 * Delete button for deleting a goal.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';


// Button for complete on swipe.
export default function CompleteButton(
  {
    onPress,
  }: {
    onPress: () => void,
  }) {
  return (
    <TouchableHighlight
      underlayColor={'white'}
      style={styles.completeButton}
      onPress={() => {onPress()}}>
      <Icon
        name={'done-all'}
        size={40}
        style={styles.completeIcon}
      />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  completeButton: {
    backgroundColor: '#006600',
    flex: 1,
    justifyContent: 'center',
  },
  completeIcon: {
    color: 'white',
    alignSelf: 'flex-end',
    marginRight: 5,
  },
});
