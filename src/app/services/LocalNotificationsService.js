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

  // Initialize local notifications.
  static init(callback: (Object) => void) {

    PushNotification.configure({
      onNotification: (notification) => {
        log("Notification: " + notification);

        callback(notification);

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
      // Only required for iOS.
      if (Platform.OS !=='ios') {
        executeOnOk();
      }
      else {
        return PushNotification.requestPermissions()
          .then((permission) => {
            // Only need alert permissions.
            if (permission.alert) executeOnOk();
            }).catch((error) => {
              log("LocalNotificationsService -> " + "handlePermissions " + error);
            });
      }
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
