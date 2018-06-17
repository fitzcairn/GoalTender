/**
 * Tests for UserStorage.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { User } from '../../app/storage/data/User.js';
import UserStorage from '../../app/storage/UserStorage';

import MockAsyncStorage from '../../__mocks__/MockAsyncStorage';

// Mock out AsyncStorage.
const storageCache = {};
const AsyncStorage = new MockAsyncStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage)


/*
 * Helper functions -->
 */
function _resetStorage() {
  Object.keys(storageCache).forEach(function(key) { delete storageCache[key]; });
}

function _addUserToStorage(user:User) {
  storageCache[UserStorage._makeKey(user.getId())] = user.toJSONString();
}


// Clear MockAsyncStorage before each test.
beforeEach(() => {
  _resetStorage(); // Storage is empty.
});


/*
 * Tests for the UserStorage class.
 */
test('UserStorage.getUser -- user exists', () => {
  const user:User = new User("uid", "date", true, "reminder");
  _addUserToStorage(user);

  return UserStorage.getUser(user.getId(), (result:User) => {
    expect(result.toJSONString()).toEqual(user.toJSONString());
  })
});

test('UserStorage.getUser -- user does NOT exist, new local user', () => {
  const user:User = UserStorage._makeUser("uid");

  return UserStorage.getUser(user.getId(), (result:User) => {
    expect(result.toJSONString()).toEqual(user.toJSONString());
  })
});

test('UserStorage.upsertUser -- user exists, no data', () => {
  const user:User = new User("uid", "date", true, "reminder")
    .setLastUpdateDateTimeToNow();
  _addUserToStorage(user);

  return UserStorage.upsertUser(user.getId(), (result:User) => {
    expect(result.toJSONString()).toEqual(user.toJSONString());
  })
});

test('UserStorage.upsertUser -- user exists, mutate FTUX', () => {
  const user:User = new User("uid", "date", false, "reminder")
    .setLastUpdateDateTimeToNow();
  _addUserToStorage(user);

  const updatedUser:User = User.fromJSONString(user.toJSONString())
    .setHasSeenFTUX(true);

  return UserStorage.upsertUser(user.getId(),
    (result:User) => {
      expect(result.toJSONString()).toEqual(updatedUser.toJSONString());
    },
    { hasSeenFTUX: true }
  );
});

test('UserStorage.upsertUser -- user exists, mutate reminder time', () => {
  const user:User = new User("uid", "date", false, "reminder")
    .setLastUpdateDateTimeToNow();
  _addUserToStorage(user);

  const updatedUser:User = User.fromJSONString(user.toJSONString())
    .setReminderTime("new reminder time");

  return UserStorage.upsertUser(user.getId(),
    (result:User) => {
      expect(result.toJSONString()).toEqual(updatedUser.toJSONString());
    },
    { reminderTime: "new reminder time" }
  );
});

test('UserStorage.upsertUser -- user exists, mutate both', () => {
  const user:User = new User("uid", "date", false, "reminder")
    .setLastUpdateDateTimeToNow();
  _addUserToStorage(user);

  const updatedUser:User = User.fromJSONString(user.toJSONString())
    .setReminderTime("new reminder time")
    .setHasSeenFTUX(true);

  return UserStorage.upsertUser(user.getId(),
    (result:User) => {
      expect(result.toJSONString()).toEqual(updatedUser.toJSONString());
    },
    { hasSeenFTUX: true,
      reminderTime: "new reminder time" }
  );
});

test('UserStorage.upsertUser -- user does NOT exist, no data', () => {
  const user:User = UserStorage._makeUser("uid")
    .setLastUpdateDateTimeToNow();
  _addUserToStorage(user);

  return UserStorage.upsertUser(user.getId(), (result:User) => {
    expect(result.toJSONString()).toEqual(user.toJSONString());
  })
});

test('UserStorage.upsertUser -- user does NOT exist, mutate FTUX', () => {
  const user:User = UserStorage._makeUser("uid")
    .setLastUpdateDateTimeToNow();
  _addUserToStorage(user);

  const updatedUser:User = User.fromJSONString(user.toJSONString())
    .setHasSeenFTUX(true);

  return UserStorage.upsertUser(user.getId(),
    (result:User) => {
      expect(result.toJSONString()).toEqual(updatedUser.toJSONString());
    },
    { hasSeenFTUX: true }
  );
});

test('UserStorage.upsertUser -- user does NOT exist, mutate reminder time', () => {
  const user:User = UserStorage._makeUser("uid")
    .setLastUpdateDateTimeToNow();
  _addUserToStorage(user);

  const updatedUser:User = User.fromJSONString(user.toJSONString())
    .setReminderTime("new reminder time");

  return UserStorage.upsertUser(user.getId(),
    (result:User) => {
      expect(result.toJSONString()).toEqual(updatedUser.toJSONString());
    },
    { reminderTime: "new reminder time" }
  );
});

test('UserStorage.upsertUser -- user does NOT exist, mutate both', () => {
  const user:User = UserStorage._makeUser("uid")
    .setLastUpdateDateTimeToNow();
  _addUserToStorage(user);

  const updatedUser:User = User.fromJSONString(user.toJSONString())
    .setReminderTime("new reminder time")
    .setHasSeenFTUX(true);

  return UserStorage.upsertUser(user.getId(),
    (result:User) => {
      expect(result.toJSONString()).toEqual(updatedUser.toJSONString());
    },
    { hasSeenFTUX: true,
      reminderTime: "new reminder time" }
  );
});
