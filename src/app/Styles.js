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
  noGoalsInstructions: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    marginBottom: 40,
  },
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
    borderColor: '#d9d9d9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    marginTop: 30,
  },
  settingsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
  },
  settingsRowView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    alignItems: "center",
    borderColor: '#d9d9d9',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  settingsRowViewLast: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    alignItems: "center",
  },
  settingsText: {
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    color: 'black',
  },
  settingsTextDisabled: {
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    color: 'gray',
  },
  settingsTextExplain: {
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    color: 'gray',
    fontStyle: 'italic',
  },
});

export default GlobalStyles;