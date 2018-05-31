/**
 * Styles for for GoalTender
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  StyleSheet,
} from 'react-native';


export const assets = {
  // TODO: add as needed.
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  settingsGroup: {
     flex: 1,
     alignItems: 'flex-start',
     justifyContent: 'flex-start',
     borderColor: 'gray',
     borderTopWidth: 1,
     borderBottomWidth: 1,
     borderLeftWidth: 0,
     borderRightWidth: 0,
     marginTop: 20,
     marginBottom: 20,
  },
  settingsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
    marginBottom: 1,
  },
  settingsText: {
    flex: 1,
    color: 'black',
    marginLeft: 15,
  },
  settingsIcon: {
    backgroundColor: 'transparent',
    color: 'gray',
  },
});

export default styles;
