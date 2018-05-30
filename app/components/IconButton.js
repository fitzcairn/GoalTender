/**
 * A scalable Icon-based button, used on multiple screens.
 *
 * @author Steve Martin
 *
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from '../Styles.js';


export default function IconButton(
  {
    onPress,
    icon,
    align,
  }: {
    onPress: () => void,
    icon: string,
    align: string,
  }) {
  return (
    <TouchableOpacity
      style={[
        styles.iconButton,
        align == 'left' ? {marginLeft: 12} : {marginRight: 12}
      ]}
      onPress={onPress}>
        <Icon name={icon} size={30} color="#000"/>
    </TouchableOpacity>
  );
}
