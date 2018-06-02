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
  View,
  Modal,
  Text,
  ActivityIndicator
} from 'react-native';

import GlobalStyles from '../Styles.js';

export default function LoadingSpinner (
  {
    modal,
    text
  }: {
    modal: boolean,
    text?: string
  }) {

  if (modal)
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={true}
        onRequestClose={() => {console.log('close modal')}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={true} />
            <Text style={GlobalStyles.info}>{text}</Text>
          </View>
        </View>
      </Modal>
    );
  return (
    <View style={styles.activityIndicator}>
      <ActivityIndicator animating={true} />
      <Text style={GlobalStyles.info}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  activityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
