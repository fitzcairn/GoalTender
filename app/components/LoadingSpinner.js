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

  const renderText = function() {
    if (typeof text != 'undefined' && text.length > 0)
      return (<Text style={GlobalStyles.info}>{text}</Text>);
  }

  if (modal)
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={true}
        onRequestClose={() => {console.log('close modal')}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorModal}>
            <ActivityIndicator animating={true} />
            { renderText() }
          </View>
        </View>
      </Modal>
    );
  return (
    <View style={styles.activityIndicatorNonModal}>
      <ActivityIndicator style={styles.activityIndicator} animating={true} />
      { renderText() }
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
  activityIndicatorModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  activityIndicatorNonModal: {
    backgroundColor: 'transparent',
    flex: 1,
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
  },
});
