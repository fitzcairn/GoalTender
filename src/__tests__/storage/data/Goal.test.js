/**
 * Tests for Goal data objects.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { Goal, GoalList } from '../../../app/storage/data/Goal.js';
import { State, StateValues } from '../../../app/storage/data/State.js';


/*
 * Tests for the Goal class.
 */
test('Goal.getId', () => {
  const goal:Goal = new Goal("id", "text", "date");
  expect(goal.getId()).toBe("id");
});

test('Goal.getText', () => {
  const goal:Goal = new Goal("id", "text", "date");
  expect(goal.getText()).toBe("text");
});

test('Goal.getDate', () => {
  const goal:Goal = new Goal("id", "text", "date");
  expect(goal.getCreateDate()).toBe("date");
});

test('Goal.getComplete', () => {
  const goal:Goal = new Goal("id", "text", "date");
  expect(goal.getComplete()).toBe(false);

  goal.setComplete(true);
  expect(goal.getComplete()).toBe(true);

  goal.setComplete(false);
  expect(goal.getComplete()).toBe(false);

  const completeGoal:Goal = new Goal("id", "text", "date", true);
  expect(completeGoal.getComplete()).toBe(true);

  const inCompleteGoal:Goal = new Goal("id", "text", "date", false);
  expect(inCompleteGoal.getComplete()).toBe(false);
});

test('Goal.getStateValue -- default should be 0', () => {
  const goal:Goal = new Goal("id", "text", "date");
  expect(goal.getStateValue()).toBe(StateValues.NONE);
});

test('Goal.setState', () => {
  const goal:Goal = new Goal("id", "text", "date");
  goal.setState(new State(StateValues.YES, "id", "date"));
  expect(goal.getStateValue()).toBe(StateValues.YES);

  goal.setState(new State(StateValues.NO, "id", "date"));
  expect(goal.getStateValue()).toBe(StateValues.NO);
});

test('Goal.toJSONString', () => {
  const goal:Goal = new Goal("id", "text", "date", true);
  expect(goal.toJSONString()).toBe(JSON.stringify({
    goalId: "id",
    goalText: "text",
    goalCreateDate: "date",
    complete: true,
  }));
});

test('Goal.fromJSONString', () => {
  const goal:Goal = new Goal("id", "text", "date", true);
  const goalString:string = JSON.stringify({
    goalId: "id",
     goalText: "text",
    goalCreateDate: "date",
    complete: true,
  });
  expect(Goal.fromJSONString(goalString).toJSONString())
   .toBe(goal.toJSONString());
});

/*
 * Tests for the GoalList class.
 */
test('GoalList.getUserId', () => {
  const goalList:GoalList = new GoalList("id");
  expect(goalList.getUserId()).toBe("id");
});

test('GoalList.addGoal/getGoal', () => {
  const goalList:GoalList = new GoalList("id");
  const goal:Goal = new Goal("gid", "text", "date");
  goalList.addGoal(goal);

  expect(goalList.getGoal("not a goal id")).toBe(undefined);
  expect(goalList.getGoal(goal.getId())).toBe(goal);
});

test('GoalList.addGoal -- should not allow duplicates', () => {
  const goalList:GoalList = new GoalList("id");
  const goal:Goal = new Goal("gid", "text", "date");
  goalList.addGoal(goal);
  goalList.addGoal(goal);
  goalList.addGoal(goal);

  expect(goalList.getGoal("not a goal id")).toBe(undefined);
  expect(goalList.getGoal(goal.getId())).toBe(goal);
});

test('GoalList.getGoals', () => {
  const goalList:GoalList = new GoalList("id");
  const goal:Goal = new Goal("gid", "text", "date");
  goalList.addGoal(goal);
  goalList.addGoal(goal);
  goalList.addGoal(goal);

  expect(goalList.getGoals()).toEqual([goal]);
});

test('GoalList.deleteGoal', () => {
  const goalList:GoalList = new GoalList("id");
  const goal1:Goal = new Goal("gid1", "text1", "date1");
  const goal2:Goal = new Goal("gid2", "text2", "date2");
  goalList.addGoal(goal1);
  goalList.addGoal(goal2);

  expect(goalList.getGoals()).toEqual([goal1, goal2]);
  goalList.deleteGoal("gid2");
  expect(goalList.getGoals()).toEqual([goal1]);
});

test('GoalList.addStates', () => {
  const goalList:GoalList = new GoalList("id");
  const goal1:Goal = new Goal("gid1", "text1", "date1");
  const goal2:Goal = new Goal("gid2", "text2", "date2");
  goalList.addGoal(goal1);
  goalList.addGoal(goal2);

  // State for goal1, "gid1".
  const state:State = new State(StateValues.YES, "gid1", "date");
  goalList.addStates([state]);

  expect(goal1.getStateValue()).toBe(StateValues.YES);
  expect(goal2.getStateValue()).toBe(StateValues.NONE);
});

test('GoalList.toJSONString', () => {
  const goalList:GoalList = new GoalList("id");
  const goal1:Goal = new Goal("gid1", "text1", "date1");
  const goal2:Goal = new Goal("gid2", "text2", "date2");
  goalList.addGoal(goal1);
  goalList.addGoal(goal2);

  expect(goalList.toJSONString()).toBe(JSON.stringify({
    userId: "id",
    goalList: [goal1.toJSONString(), goal2.toJSONString()],
  }));
});

test('GoalList.fromJSONString', () => {
  const goalList:GoalList = new GoalList("id");
  const goal1:Goal = new Goal("gid1", "text1", "date1");
  const goal2:Goal = new Goal("gid2", "text2", "date2");
  goalList.addGoal(goal1);
  goalList.addGoal(goal2);

  const goalListString:string = JSON.stringify({
    userId: "id",
    goalList: [goal1.toJSONString(), goal2.toJSONString()],
  });

  expect(GoalList.fromJSONString(goalListString).toJSONString())
   .toBe(goalList.toJSONString());
});
