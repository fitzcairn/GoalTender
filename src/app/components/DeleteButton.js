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


// Button for delete on swipe.
export default function DeleteButton(
  {
    onPress,
  }: {
    onPress: () => void,
  }) {
  return (
    <TouchableHighlight
      underlayColor={'white'}
      style={styles.deleteButton}
      onPress={() => {onPress()}}>
      <Icon
        name={'delete-forever'}
        size={40}
        style={styles.deleteIcon}
      />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#cc0000',
    flex: 1,
    justifyContent: 'center',
  },
  deleteIcon: {
    color: 'white',
    alignSelf: 'flex-end',
    marginRight: 4,
  },
});
