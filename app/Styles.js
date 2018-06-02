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


const GlobalStyles = StyleSheet.create({
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
  info: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    margin: 10,
  },
  error: {
    textAlign: 'center',
    color: '#ff8000',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  buttonDisabled: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor:'#99ccff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#99ccff'
  },
  buttonText: {
    fontSize: 20,
    color:'#fff',
    textAlign:'center',
    marginLeft: 30,
    marginRight: 30,
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

export default GlobalStyles;
