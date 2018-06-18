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

  // Wrapper for permissions.
  static handlePermissions() {
    // Really not sure what to do here. :(
    PushNotification.checkPermissions();
    PushNotification.requestPermissions();
  }

  static scheduleReminderNotifications(isoTime: string) {
    // First, clear existing notifications--can only have one reminder
    // scheduled.
    this.clearReminderNotifications();

    // Schedule the notification.
    PushNotification.localNotificationSchedule({
      message: Localized('Notifications.message'),
      date: parseISODateString(isoTime),
      repeatType: 'daily',
    });
  }

  static clearReminderNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }
}

LocalNotificationsService.init()
