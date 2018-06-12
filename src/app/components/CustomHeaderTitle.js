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

import GlobalStyles from '../Styles.js';

export default function CustomHeaderTitle(
  {
    title,
    subtitle,
  }: {
    title:string,
    subtitle:?string,
  }) {
    return (
    <View style={styles.titleView}>
      <Text style={[styles.titleText, GlobalStyles.headerTitleFontSize]}>
        {title}
      </Text>
      {
        (subtitle != null ?
          (<Text style={[styles.subTitleText,
            GlobalStyles.headerSubtitleFontSize]}>
            {subtitle}
          </Text>)
          : null)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  titleView: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16,
  },
  subTitleText: {
    color: 'grey'
  },
});
