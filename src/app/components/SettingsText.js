/**
 * A text row in settings.
 *
 * @author Steve Martin
 *
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import GlobalStyles from '../Styles.js';

export default function SettingsText(
  {
    isLast,
    title,
    text,
  }: {
    isLast?: boolean,
    title: string,
    text: string,
  }) {
  const viewStyle = (
    isLast ? styles.settingsTextRowViewLast : styles.settingsTextRowView);
  return (
    <View style={GlobalStyles.settingsRow}>
      <View style={viewStyle}>
        <Text style={[styles.settingsText, GlobalStyles.defaultFontSize]}>
          {title}
        </Text>
        <Text style={[styles.settingsTextDisabled, GlobalStyles.defaultFontSize]}>
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsText: {
    textAlign: 'left',
    marginTop: 10,
    flex: 1,
    color: 'black',
  },
  settingsTextDisabled: {
    textAlign: 'left',
    marginBottom: 10,
    flex: 1,
    color: 'gray',
  },
  settingsTextRowView: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 15,
    alignItems: "flex-start",
    borderColor: '#d9d9d9',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  settingsTextRowViewLast: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 15,
    alignItems: "flex-start",
  },
});
