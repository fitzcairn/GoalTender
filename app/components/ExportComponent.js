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


const _states = {
  NONE: 0,
  GENERATING_FILE: 1,
  FILE_READY: 2,
};

type Props = {
  onFinish: () => void,
};

type State = {
  exportState: number,
};

// Componenent to manage data export from GoalTender.
export default class ExportComponent extends Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      exportState: _states.NONE,
    };
  }

  _startGenerateDataExport() {
    this.setState({
      exportState: _states.GENERATING_FILE,
    });
    ExportService.generateGoalDataFile(() => {
      this.setState({
        exportState: _states.FILE_READY,
      });
    });
    return;
  }

  render() {
    let renderReturn = null;

    switch(this.state.exportState) {

      case _states.GENERATING_FILE:
        renderReturn = (
          <LoadingSpinner modal={true} text="Generating Data File..."/>
        );
      break;

      case _states.FILE_READY:
        Alert.alert(
          'EMAIL CLIENT PLACEHOLDER',
          "TODO: in place of this, pop an email with the file attached.",
          [
            {text: 'Close', style: 'cancel', onPress: () => this.props.onFinish()},
          ],
          { cancelable: false },
        )
        break;

      case _states.NONE:
      default:
        Alert.alert(
          'Export Data?',
          "It may take a few seconds to generate the export file.",
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: () => this._startGenerateDataExport()},
          ],
          { cancelable: false },
        )
        break;
    }

    return renderReturn;
  }
}
