/**
 * Tests for Goal data objects.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { User } from '../../../app/storage/data/User.js';


/*
 * Tests for the User class.
 */
test('User.getId', () => {
  const user:User = new User("id", "date", false);
  expect(user.getId()).toBe("id");
});

test('User.getHasSeenFTUX', () => {
  const user:User = new User("id", "date", false);
  expect(user.getHasSeenFTUX()).toBe(false);
  const user2:User = new User("id", "date", true);
  expect(user2.getHasSeenFTUX()).toBe(true);
});

test('User.getReminderTime', () => {
  const user:User = new User("id", "date", false, "reminder");
  expect(user.getReminderTime()).toBe("reminder");
  const user2:User = new User("id", "date", false);
  expect(user2.getReminderTime()).toBe(undefined);
});

test('User.getLastUpdateDateTime', () => {
  const user:User = new User("id", "date", false);
  expect(user.getLastUpdateDateTime()).toBe("date");
});

test('User.setHasSeenFTUX', () => {
  const user:User = new User("id", "date", true);

  // Undefined should not change the value.
  expect(user.setHasSeenFTUX().getHasSeenFTUX()).toBe(true);
  expect(user.setHasSeenFTUX(false).getHasSeenFTUX()).toBe(false);
  expect(user.setHasSeenFTUX().getHasSeenFTUX()).toBe(false);
  expect(user.setHasSeenFTUX(true).getHasSeenFTUX()).toBe(true);
});

test('User.setReminderTime', () => {
  const user:User = new User("id", "date", true, "reminder");

  // Undefined should not change the value.
  expect(user.setReminderTime().getReminderTime()).toBe("reminder");
  expect(user.setReminderTime("new").getReminderTime()).toBe("new");
  expect(user.setReminderTime().getReminderTime()).toBe("new");
  expect(user.setReminderTime("reminder").getReminderTime()).toBe("reminder");
});

test('User.toJSONString', () => {
  const user:User = new User("id", "date", true, "reminder");
  expect(user.toJSONString()).toBe(JSON.stringify({
    userId: "id",
    lastUpdateDateTime: "date",
    hasSeenFTUX: true,
    reminderTime: "reminder",
  }));
});

test('User.fromJSONString', () => {
  const user:User = new User("id", "date", true, "reminder");
  const userString:string = JSON.stringify({
    userId: "id",
    lastUpdateDateTime: "date",
    hasSeenFTUX: true,
    reminderTime: "reminder",
  });
  expect(User.fromJSONString(userString).toJSONString())
    .toBe(user.toJSONString());
});
