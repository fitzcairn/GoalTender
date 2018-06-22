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

// E-email
import Mailer from 'react-native-mail';

// Components
import LoadingSpinner from '../components/LoadingSpinner.js';

// Services
import ExportService from '../services/ExportService.js';
import { User } from '../storage/data/User.js';

import { log } from '../Util.js';

import Localized from '../Strings.js';


const _states = {
  NONE: 0,
  GENERATING_FILE: 1,
  ERROR_NO_DATA: 2,
  ERROR_UNKNOWN: 3,
  ERROR_NO_ACCOUNT: 4,
  DONE: 5,
  FILE_READY: 6,
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
        if (csv)
          this.setState({
            exportState: _states.FILE_READY,
            csv: csv,
          });
        else {
          this.setState({
            exportState: _states.ERROR_NO_DATA,
          });
        }
      },
      () => this._setDoneState(_states.ERROR_UNKNOWN));
  }

  _setDoneState(state: number) {
    this.setState({
      exportState: state,
      csv: null,
    });
  }

  _handleEmail() {
    const csv:string|null = this.state.csv;
    if (csv == null) {
      return this._setDoneState(_states.ERROR_UNKNOWN);
    }

    return Mailer.mail(
      {
        subject: Localized('Settings.exportEmail.subject'),
        isHTML: false,
        body: Localized('Settings.exportEmail.body') + csv,
      },
      (error, event) => {
        log(error);
        log(event);
        // Only regenerate the file on error.  Otherwise, if the user taps
        // "Export" again re-use the state we just generated.
        if (error === 'not_available') {
          this._setDoneState(_states.ERROR_NO_ACCOUNT);
        }
        else if (error) {
          this._setDoneState(_states.ERROR_UNKNOWN);
        }
        else {
          this._setDoneState(_states.DONE);
        }
      }
    );
  }

  render() {
    let renderReturn = null;

    switch(this.state.exportState) {

      case _states.GENERATING_FILE:
        // THe below breaks on iOS; leaving it there to come back and
        // investigate further.
        /*renderReturn = (
          <LoadingSpinner modal={true} text={
            Localized('Settings.exportLoading.generating')
          }/>
        );*/
        break;

      case _states.DONE:
        renderReturn = null;
        this.props.onFinish();
        break;

      case _states.ERROR_NO_DATA:
        Alert.alert(
          Localized('Settings.exportAlerts.errorNoData.title'),
          Localized('Settings.exportAlerts.errorNoData.message'),
          [
            {text: 'Close', style: 'cancel', onPress: () => this.props.onFinish()},
          ],
          { cancelable: false },
        )
        break;

      case _states.ERROR_NO_ACCOUNT:
        Alert.alert(
          Localized('Settings.exportAlerts.errorNoAccount.title'),
          Localized('Settings.exportAlerts.errorNoAccount.message'),
          [
            {text: 'Close', style: 'cancel', onPress: () => this.props.onFinish()},
          ],
          { cancelable: false },
        )
        break;

      case _states.ERROR_UNKNOWN:
        Alert.alert(
          Localized('Settings.exportAlerts.errorUnknown.title'),
          Localized('Settings.exportAlerts.errorUnknown.message'),
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
          Localized('Settings.exportAlerts.exportStart.title'),
          Localized('Settings.exportAlerts.exportStart.message'),
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
