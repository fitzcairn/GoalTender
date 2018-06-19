/**
 * Wrapper to set up and manage notifications.
 *
 * @author Steve Martin
 *
 * @flow
 */

 import {
   PushNotificationIOS,
   Platform
 } from 'react-native';

import PushNotification from 'react-native-push-notification'

import { log } from '../Util.js'
import { parseISODateString } from '../Dates.js'
import Localized from '../Strings.js';

export default class LocalNotificationsService {
  static init() {
    LocalNotificationsService.configure();
  }

  static configure() {
  PushNotification.configure({
    onNotification: (notification) => {
      log("Notification: " + notification);
      // Required for iOS.
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    popInitialNotification: false,

    /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
    requestPermissions: false,
    })
  }

  // Wrapper for permissions, returns a Promise.
  static async handlePermissions(
    executeOnOk: () => {},
  ) {
    // Really not sure what to do here. :(
    return PushNotification.requestPermissions()
    .then((permission) => {

      log(permission);

      if (Platform.OS === 'ios') {
        if (permission.alert) executeOnOk();
      }
      else {
        // What to check on Android?
        executeOnOk();
      }
    }).catch((error) => {
      log("LocalNotificationsService -> " + "handlePermissions " + error);
    });
  }

  static scheduleReminderNotifications(isoTime: string) {
    // First, clear existing notifications--can only have one reminder
    // scheduled.
    this.clearReminderNotifications();

    // Schedule the notification.
    PushNotification.localNotificationSchedule({
      message: Localized('Notifications.message'),
      date: parseISODateString(isoTime),
      repeatType: Platform.OS === 'ios' ? 'day' : 'daily',
    });
  }

  static clearReminderNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }
}

LocalNotificationsService.init()
