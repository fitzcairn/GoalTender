/**
 * Data service for managing user state in GoalTender.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { AsyncStorage } from 'react-native';

import UserStorage from '../storage/UserStorage.js';

import { User } from '../storage/data/User.js';


export default class UserService {

  // Get a user.
  static async getUser(
    userId: string | null,
    callback: (User) => void) {
      return UserStorage.getUser(userId, callback);
  }

  // Update a user's login time, or create a new one locally.
  static async updateUserDatetime(
    userId: string | null,
    callback: (User) => void) {
      return UserStorage.upsertUser(userId, callback);
  }

  // Set a user's FTUX state, or create a new one locally.
  static async updateUserFTUX(
    userId: string | null,
    hasSeenFTUX: boolean,
    callback: (User) => void) {
      return UserStorage.upsertUser(
        userId, callback, {hasSeenFTUX: hasSeenFTUX});
  }

  // Set a user's reminder time.
  static async updateUserReminder(
    userId: string | null,
    remindersOn: boolean,
    reminderTime: string,
    callback: (User) => void) {
      return UserStorage.upsertUser(
        userId, callback, {
          remindersOn: remindersOn,
          reminderTime: reminderTime,
        });
  }
}
