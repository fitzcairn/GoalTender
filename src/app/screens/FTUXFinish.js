/**
 * Daily Goals screen.  This is where the majority of app interaction will
 * take place.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';
import type { Node } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-swipeable';

import Localized from '../Strings.js';

import GlobalStyles from '../Styles.js';

import GoalRow from '../components/GoalRow.js';
import AddButton from '../components/AddButton.js';
import DeleteButton from '../components/DeleteButton.js';
import CompleteButton from '../components/CompleteButton.js';

import { StateValues } from '../storage/data/State.js'

import { log } from '../Util.js';


type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// FTUX screen explaining how goals work.
export default class FTUXFinish extends Component<Props> {

  render() {

    return (
      <View style={styles.goalsView}>
        <View style={styles.goalInstructionsView}>

          <View style={styles.addRow}>

            <View style={styles.addRowText}>
              <Text style={[GlobalStyles.instructions, GlobalStyles.titleFontSize]}>
                {Localized('FTUXFinish.addInstructions')}
              </Text>
            </View>
            <View style={styles.addRowButton}>
              <TouchableHighlight
                underlayColor={'transparent'}
                onPress={() => {}}>
                <View>
                  <Icon
                    name={'fiber-manual-record'}
                    size={70}
                    style={styles.addIconBg}
                  />
                  <Icon
                    name={'add-circle'}
                    size={70}
                    style={styles.addIconShadow}
                  />
                  <Icon
                    name={'add-circle'}
                    size={70}
                    style={styles.addIcon}
                  />
                </View>
              </TouchableHighlight>
            </View>
          </View>

          <View style={styles.goalRowInstruction}>
            <Text style={[GlobalStyles.instructions, GlobalStyles.titleFontSize]}>
              {Localized('FTUXFinish.goalInstructions')}
            </Text>
            <ScrollView scrollEnabled={false} style={styles.scrollView}>
              <GoalRow
                disabled={false}
                label={Localized('FTUXFinish.goalInstructionsGoalText')}
                goalId={"fake"}
                userId={"fake"}
                onTouch={() => {}}
                state={StateValues.NONE} />
            </ScrollView>
          </View>

          <View style={styles.goalRowInstruction}>
            <Text style={[GlobalStyles.instructions, GlobalStyles.titleFontSize]}>
              {Localized('FTUXFinish.deleteInstructions')}
            </Text>
            <ScrollView scrollEnabled={false} style={styles.scrollView}>
              <Swipeable
                leftButtonWidth={50}
                key={1}
                rightActionActivationDistance={25}
                leftButtons={[
                  <DeleteButton onPress={() => {}} />,
                  <CompleteButton onPress={() => {}} />,
                ]}
                >
                <GoalRow
                  disabled={false}
                  label={Localized('FTUXFinish.goalInstructionsDeleteText')}
                  goalId={"fake"}
                  userId={"fake"}
                  onTouch={() => {}}
                  state={StateValues.YES} />
              </Swipeable>
            </ScrollView>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={GlobalStyles.button}
              onPress={() => this.props.navigation.navigate('Daily')}>
              <Text style={[GlobalStyles.buttonText, GlobalStyles.titleFontSize]}>
                {Localized('FTUXFinish.button')}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  goalInstructionsView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flex: 1,
    borderWidth: 0,
    justifyContent: 'center',
  },
  addRow: {
    flex: 1,
    borderWidth: 0,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  addRowText: {
    borderWidth: 0,
    justifyContent: 'center',
  },
  addRowButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalRowInstruction: {
    flex: 1,
    borderWidth: 0,
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  scrollView: {
    flexGrow: 0,
  },
  goalsView: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  },
  addIcon: {
    color: '#cc0000',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  addIconShadow: {
    position: 'absolute',
    left: 1,
    top: 1,
    color: '#666666',
    backgroundColor: 'transparent',
  },
  addIconBg: {
    position: 'absolute',
    color: 'white',
    backgroundColor: 'transparent',
  },
});
