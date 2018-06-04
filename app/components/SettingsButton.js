/**
 * A button representing a setting.
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
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalStyles from '../Styles.js';


export default function SettingsButton(
  {
    onPress,
    isLast,
    label,
  }: {
    onPress: () => void,
    isLast?: boolean,
    label: string,
  }) {
  const viewStyle = (isLast ? GlobalStyles.settingsRowViewLast : GlobalStyles.settingsRowView);
  return (
    <TouchableOpacity style={GlobalStyles.settingsRow} onPress={onPress}>
      <View style={viewStyle}>
        <Text style={GlobalStyles.settingsText}>{label}</Text>
        <Icon name='chevron-right' style={styles.settingsIcon} size={30}/>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  settingsIcon: {
    backgroundColor: 'transparent',
    color: '#d9d9d9',
    alignSelf: 'center',
  },
});
