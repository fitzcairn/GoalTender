/**
 * Styles for for GoalTender
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
} from 'react-native';

/*
 * Typography references:
 * https://material.io/design/typography/#type-scale
 * https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/
 */
const GlobalStyles = StyleSheet.create({
  // Global font sizes, referencing the above.
  defaultFontSize: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
  },
  splashFontSize: { // Title 1 on iOS, H4 on Android
    fontSize: Platform.OS === 'ios' ? 28 : 34,
  },
  titleFontSize: { // H3 on iOS, H6 on Android
    fontSize: Platform.OS === 'ios' ? 20 : 20,
  },
  headerTitleFontSize: { // H2 on iOS, H5 on Android
    fontSize: Platform.OS === 'ios' ? 22 : 24,
  },
  headerSubtitleFontSize: { // Subhead on iOS, Subtitle 1 on Android
    fontSize: Platform.OS === 'ios' ? 15 : 16,
  },

  defaultHeaderStyle: {
    flex: 1,
    textAlign: 'center',
  },
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
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  info: {
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
  reminderSettingsToggleRowView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    alignItems: "center",
  },
  reminderSettingsDateRowView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    alignItems: "center",

    borderColor: '#d9d9d9',
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  settingsIcon: {
    backgroundColor: 'transparent',
    color: '#d9d9d9',
    alignSelf: 'center',
  },
  settingsText: {
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    color: 'black',
  },
  settingsTextClickable: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    color: 'blue',
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
