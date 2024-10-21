import { describe, test, expect } from 'vitest';

import Event from '../../scr/event.js';

describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let event = new Event();
    let eventOther = new Event();

    event.copy(eventOther);
    
    expect(event).toEqual(eventOther);
    expect(event).not.toBe(eventOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'Event'", () => {
    let event = new Event();
    let eventStr = "eventStr";

    expect(() => event.copy(eventStr)).toThrowError(/Event/);
  });


  test("this.getCopy() should return a 'Event'", () => {
    let eventOther = new Event();
    let event = eventOther.getCopy();

    expect(event).toBeInstanceOf(Event);
  });

  test("this.getCopy() should return a 'Event' which is " +
  "a deep copy of 'this'", () => {
    let eventOther = new Event();
    let event = eventOther.getCopy();

    expect(eventOther).toEqual(event);
    expect(eventOther).not.toBe(event);
  });
});
