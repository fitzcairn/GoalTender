/**
 * Tests for Goal data objects.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { Goal, GoalList } from '../../app/storage/data/Goal';
import GoalStorage from '../../app/storage/GoalStorage';

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

function _addGoalsToStorage(userId:string): GoalList {
  const goalList:GoalList = new GoalList(userId);
  const goal1:Goal = new Goal("gid1", "text1", "date1");
  const goal2:Goal = new Goal("gid2", "text2", "date2");
  goalList.addGoal(goal1);
  goalList.addGoal(goal2);
  storageCache[GoalStorage._makeKey(userId)] = goalList.toJSONString();
  return goalList;
}


// Clear MockAsyncStorage before each test.
beforeEach(() => {
  _resetStorage(); // Storage is empty.
});


/*
 * Tests for the GoalStorage class.
 */
test('GoalStorage.getGoals', () => {
  const userId:string = "uid";
  const goalList:GoalList = _addGoalsToStorage(userId);

  return GoalStorage.getGoals(userId, (result:GoalList) => {
    expect(result.toJSONString()).toEqual(goalList.toJSONString());
  })
});

test('GoalStorage.getGoals -- no results, should be empty', () => {
  const userId:string = "uid";
  _addGoalsToStorage("not userId");

  return GoalStorage.getGoals(userId, (result:GoalList) => {
    expect(result.toJSONString()).toEqual(new GoalList(userId).toJSONString());
  })
});

test('GoalStorage.addGoal -- add first goal', () => {
  const userId:string = "uid";
  const goalList:GoalList = new GoalList(userId);

  return GoalStorage.addGoal(userId, "text", (goal:Goal) => {
    goalList.addGoal(goal);
  }).done(() => {
    expect(storageCache[GoalStorage._makeKey(userId)])
      .toEqual(goalList.toJSONString());
  });

});
