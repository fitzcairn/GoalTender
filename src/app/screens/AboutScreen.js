/**
 * Simple About screen.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import Localized from '../Strings.js';

import { getVersion } from '../Util.js';

import GlobalStyles from '../Styles.js';

import SettingsText from '../components/SettingsText.js';
import SettingsButton from '../components/SettingsButton.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// App Settings
export default class SettingsScreen extends Component<Props> {


  render() {
    return (
      <View>
        <ScrollView>
          <View style={GlobalStyles.settingsGroup}>
            <SettingsText
              title={Localized('About.version')}
              text={ getVersion() }
            />
            <SettingsButton
              label={Localized('About.github')}
              isLast={true}
              onPress={() => {
                Linking.openURL("https://github.com/fitzcairn/GoalTender")
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
