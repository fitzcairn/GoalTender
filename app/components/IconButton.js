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


export default function IconButton(
  {
    onPress,
    icon,
    align,
    iconColor,
  }: {
    onPress: () => void,
    icon: string,
    align: string,
    iconColor: ?string,
  }) {
  return (
    <TouchableOpacity
      style={[
        styles.iconButton,
        align == 'left' ? {marginLeft: 12} : {marginRight: 12}
      ]}
      onPress={onPress}>
        <Icon name={icon}
          size={30}
          color={(iconColor == null? "#000" : iconColor)}
        />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    backgroundColor: 'transparent',
    flex: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
