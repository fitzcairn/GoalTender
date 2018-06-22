/**
 * Add button for creating a new goal.
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


// Add goal button
export default function AddButton(
  {
    onPress,
    style,
  }: {
    onPress: () => void,
    style: Object,
  }) {
  return (
    <TouchableHighlight
      underlayColor={'transparent'}
      style={style}
      onPress={() => {onPress()}}>
      <View style={styles.addView}>
        <Icon
          name={'fiber-manual-record'}
          size={70}
          style={styles.addIconBg}
        />
        <Icon
          name={'add-circle'}
          size={70}
          style={styles.addIconShadow}
        />
        <Icon
          name={'add-circle'}
          size={70}
          style={styles.addIcon}
        />
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  addIcon: {
    flex: 1,
    color: '#cc0000',
    backgroundColor: 'transparent',
  },
  addIconShadow: {
    position: 'absolute',
    flex: 1,
    left: 1,
    top: 1,
    color: '#666666',
    backgroundColor: 'transparent',
  },
  addIconBg: {
    position: 'absolute',
    flex: 1,
    color: 'white',
    backgroundColor: 'transparent',
  },
  addView: {
    marginRight: 8,
    marginBottom: 8,
  },
});
