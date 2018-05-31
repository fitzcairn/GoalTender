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
import styles from '../Styles.js';


export default function SettingsButton(
  {
    onPress,
    label,
  }: {
    onPress: () => void,
    label: string,
  }) {
  return (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress}>
      <Text style={styles.settingsText}>{label}</Text>
      <Icon name='chevron-right' style={styles.settingsIcon} size={30}/>
    </TouchableOpacity>
  );
}
