/**
 * Tests for Goal data objects.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { Goal, GoalList } from '../../../app/storage/data/Goal.js';
import { State, StateValues, StateDatesList } from '../../../app/storage/data/State.js';


/*
 * Tests for the State class.
 */
test('State.getState', () => {
  const state:State = new State(StateValues.NO, "id", "date");
  expect(state.getState()).toBe(StateValues.NO);
});

test('State.getStateString', () => {
  const state:State = new State(StateValues.NO, "id", "date");
  expect(state.getStateString()).toBe("NO");
});

test('State.getGoalId', () => {
  const state:State = new State(StateValues.NO, "id", "date");
  expect(state.getGoalId()).toBe("id");
});

test('State.getDate', () => {
  const state:State = new State(StateValues.NO, "id", "date");
  expect(state.getDate()).toBe("date");
});

test('State.toJSONString', () => {
  const state:State = new State(StateValues.NO, "id", "date");
  const stateString:string = JSON.stringify({
    goalId: "id",
    date: "date",
    state: StateValues.NO,
  });
  expect(state.toJSONString()).toBe(stateString);
});

test('State.fromJSONString', () => {
  const state:State = new State(StateValues.NO, "id", "date");
  const stateString:string = JSON.stringify({
    goalId: "id",
    date: "date",
    state: StateValues.NO,
  });
  expect(State.fromJSONString(stateString).toJSONString())
   .toBe(state.toJSONString());
});

/*
 * Tests for the StateDatesList class.
 */
test('StateDatesList.getUserId', () => {
  const stateList:StateDatesList = new StateDatesList("uid", "gid", ["date1", "date2"]);
  expect(stateList.getUserId()).toBe("uid");
});

test('StateDatesList.getGoalId', () => {
  const stateList:StateDatesList = new StateDatesList("uid", "gid", ["date1", "date2"]);
  expect(stateList.getGoalId()).toBe("gid");
});

test('StateDatesList.getDates', () => {
  const dates = ["date1", "date2"];
  const stateList:StateDatesList = new StateDatesList("uid", "gid", dates);
  expect(stateList.getDates()).toEqual(dates);
});

test('StateDatesList.addDate', () => {
  const dates = ["date1", "date2"];
  const stateList:StateDatesList = new StateDatesList("uid", "gid", dates);
  expect(stateList.addDate("date3").getDates()).toEqual(["date1", "date2", "date3"]);
});

test('StateDatesList.addDate -- should not allow duplicate dates.', () => {
  const dates = ["date1", "date2"];
  const stateList:StateDatesList = new StateDatesList("uid", "gid", dates);
  expect(stateList.addDate("date1").getDates()).toEqual(dates);
});

test('StateDatesList.toJSONString', () => {
  const dates = ["date1", "date2"];
  const stateList:StateDatesList = new StateDatesList("uid", "gid", dates);
  const stateString:string = JSON.stringify({
    userId: "uid",
    goalId: "gid",
    dateList: dates,
  });
  expect(stateList.toJSONString()).toBe(stateString);
});

test('StateDatesList.fromJSONString', () => {
  const dates = ["date1", "date2"];
  const stateList:StateDatesList = new StateDatesList("uid", "gid", dates);
  const stateString:string = JSON.stringify({
    userId: "uid",
    goalId: "gid",
    dateList: dates,
  });
  expect(StateDatesList.fromJSONString(stateString).toJSONString())
   .toBe(stateList.toJSONString());
});
