/**
 * Tests for Goal data objects.
 *
 * @author Steve Martin
 *
 * @flow
 */

import { Goal, GoalList } from '../../app/storage/data/Goal.js';
import { State, StateValues } from '../../app/storage/data/State.js';


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
 });GoalList

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
