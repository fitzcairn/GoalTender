/**
 * Component for handling exporting data from Goaltender.
 *
 * @author Steve Martin
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  Alert,
} from 'react-native';


// Components
import LoadingSpinner from '../components/LoadingSpinner.js';

// Services
import ExportService from '../services/ExportService.js';
import { User } from '../storage/data/User.js';

import { log } from '../Util.js';

// E-email
import Mailer from 'react-native-mail';


const _states = {
  NONE: 0,
  GENERATING_FILE: 1,
  ERROR: 2,
  FILE_READY: 3,
};

type Props = {
  onFinish: () => void,
};

type State = {
  exportState: number,
  csv: string|null
};

// Componenent to manage data export from GoalTender.
export default class ExportComponent extends Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      exportState: _states.NONE,
      csv: null,
    };
  }

  _startGenerateDataExport() {
    this.setState({
      exportState: _states.GENERATING_FILE,
    });

    // Kick off generating the file.
    ExportService.generateGoalDataFile(
      (csv: string) => {
        this.setState({
          exportState: _states.FILE_READY,
          csv: csv,
        });
      },
      () => this._setError());
  }

  _setError() {
    this.setState({
      exportState: _states.ERROR,
      csv: null,
    });
  }

  _handleEmail() {
    const csv:string|null = this.state.csv;
    if (csv == null) {
      return this.setState({
        exportState: _states.ERROR,
        csv: null,
      });
    }
    return Mailer.mail(
      {
      subject: 'Your Daily Goal Progress, from GoalTender',
      isHTML: false,
      body: csv,
      },
      (error, event) => {
        log(error);
        this._setError();
      }
    );
  }

  render() {
    let renderReturn = null;
    switch(this.state.exportState) {

      case _states.GENERATING_FILE:
        renderReturn = (
          <LoadingSpinner modal={true} text="Generating Data File..."/>
        );
      break;

      case _states.ERROR:
        Alert.alert(
          'Uh-Oh!',
          "Unfortunately, there was an error exporting your data.\n\n" +
          "Please try again later.",
          [
            {text: 'Close', style: 'cancel', onPress: () => this.props.onFinish()},
          ],
          { cancelable: false },
        )
      break;

      case _states.FILE_READY:
        this._handleEmail();
        break;

      case _states.NONE:
      default:
        Alert.alert(
          'Export Goal Progress?',
          "Goal progress data will be converted into CSV format and exported " +
          "into the  email app on your device.\n\nNote: it may take a moment " +
          "to generate the export data.",
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Start Export', onPress: () => this._startGenerateDataExport()},
          ],
          { cancelable: false },
        )
        break;
    }

    return renderReturn;
  }
}
