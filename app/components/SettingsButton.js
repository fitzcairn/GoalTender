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
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalStyles from '../Styles.js';


export default function SettingsButton(
  {
    onPress,
    label,
  }: {
    onPress: () => void,
    label: string,
  }) {
  return (
    <TouchableOpacity style={GlobalStyles.settingsRow} onPress={onPress}>
      <Text style={GlobalStyles.settingsText}>{label}</Text>
      <Icon name='chevron-right' style={GlobalStyles.settingsIcon} size={30}/>
    </TouchableOpacity>
  );
}
