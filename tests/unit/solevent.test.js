import { describe, test, expect } from 'vitest';

import SolEvent from '../../scr/solevent.js';

import * as enums from '../../scr/exportenums.js';

describe("copying", () => {
  test("this.copy(other) should make a deep copy of 'other'", () => {
    let event = new SolEvent();
    let eventOther = new SolEvent();

    event.copy(eventOther);
    
    expect(event).toEqual(eventOther);
    expect(event).not.toBe(eventOther);
  });

  test("this.copy(other) should throw an error if 'other' is not " +
  "a 'Event'", () => {
    let event = new SolEvent();
    let eventStr = "eventStr";

    expect(() => event.copy(eventStr)).toThrowError(/SolEvent/);
  });


  test("this.getCopy() should return a 'SolEvent'", () => {
    let eventOther = new SolEvent();
    let event = eventOther.getCopy();

    expect(event).toBeInstanceOf(SolEvent);
  });

  test("this.getCopy() should return a 'SolEvent' which is " +
  "a deep copy of 'this'", () => {
    let eventOther = new SolEvent();
    let event = eventOther.getCopy();

    expect(eventOther).toEqual(event);
    expect(eventOther).not.toBe(event);
  });
});

describe("typing", () => {
  test("this.getType() should return a 'Number'", () => {
    let event = new SolEvent();

    let type = event.getType();

    expect(type).toBeTypeOf('number');
  });

  test("this.getType() should return a 'Number' which matches " +
  "the enum associated with this type", () => {
    let event = new SolEvent();
    let expected = enums.Event.DEFAULT;

    let type = event.getType();

    expect(type).toEqual(expected);
  });
});
