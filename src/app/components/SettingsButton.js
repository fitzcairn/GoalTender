/**
 * A button representing a setting.
 *
 * @author Steve Martin
 *
 * @flow
 */
import React from 'react';
import {
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
    disabled,
  }: {
    onPress: () => void,
    isLast?: boolean,
    label: string,
    disabled?: boolean,
  }) {
  const viewStyle = (isLast ? GlobalStyles.settingsRowViewLast : GlobalStyles.settingsRowView);
  return (
    <TouchableOpacity
      disabled={disabled}
      style={GlobalStyles.settingsRow}
      onPress={ (disabled? () => {} : onPress) }>
      <View style={viewStyle}>
        <Text style={
          (disabled ?
            [GlobalStyles.settingsTextDisabled, GlobalStyles.defaultFontSize] :
            [GlobalStyles.settingsText, GlobalStyles.defaultFontSize])
        }>
          {label}
        </Text>
        <Icon name='chevron-right' style={GlobalStyles.settingsIcon} size={30}/>
      </View>
    </TouchableOpacity>
  );
}
