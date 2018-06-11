/**
 * Custom header with two rows.
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
  View,
} from 'react-native';


export default function CustomHeaderTitle(
  {
    title,
    subtitle,
  }: {
    title:string,
    subtitle:string,
  }) {
    return (
    <View style={styles.titleView}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.subTitleText}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleView: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16,
  },
  subTitleText: {
    fontSize: Platform.OS === 'ios' ? 12 : 14,
    color: 'grey'
  },
});
