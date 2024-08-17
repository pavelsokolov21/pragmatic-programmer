import { describe, it, expect, beforeEach, mock, spyOn } from "bun:test";
import { FSM } from "../finite-state-machine";

describe("FNS", () => {
  let fns;

  beforeEach(() => {
    fns = new FSM("initial", {
      initial: {
        doAnother: "another",
      },
      another: {
        doInitial: "initial",
      },
    });
  });

  it("should notify subscribers by sending action", () => {
    const mockSub1 = mock(() => null);
    const mockSub2 = mock(() => null);

    fns.subscribe(mockSub1, "initial");
    fns.subscribe(mockSub2, "another");

    fns.send("doAnother");

    expect(mockSub1).not.toHaveBeenCalled();
    expect(mockSub2).toHaveBeenCalled();
  });

  it("should notify subscribers by immediately state", () => {
    const mockSub1 = mock(() => null);
    const mockSub2 = mock(() => null);

    fns.subscribe(mockSub1, "initial");
    fns.subscribe(mockSub2, "another");

    fns.notifyImmediately();

    expect(mockSub1).toHaveBeenCalled();
    expect(mockSub2).not.toHaveBeenCalled();
  });

  it("should show error in console by subscribing on unexpected trigger state", () => {
    const consoleErrSpy = spyOn(console, "error").mockImplementationOnce(
      () => null
    );

    fns.subscribe(() => null, "undefinedAction");

    expect(consoleErrSpy).toHaveBeenCalled();
  });

  it("should show error in console by subscribing without state", () => {
    const consoleErrSpy = spyOn(console, "error").mockImplementationOnce(
      () => null
    );

    fns.subscribe(() => null);

    expect(consoleErrSpy).toHaveBeenCalled();
  });

  it("should unsubscribe action", () => {
    const mockSub1 = mock(() => null);
    const mockSub2 = mock(() => null);

    const unsub1 = fns.subscribe(mockSub1, "initial");
    fns.subscribe(mockSub2, "another");

    unsub1();

    fns.notifyImmediately();

    expect(mockSub1).not.toHaveBeenCalled();
    expect(mockSub2).not.toHaveBeenCalled();
  });

  it("should console warn if current and next state are same", () => {
    const consoleWarnSpy = spyOn(console, "warn").mockImplementationOnce(
      () => null
    );

    const mockSub1 = mock(() => null);
    const mockSub2 = mock(() => null);

    fns.subscribe(mockSub1, "initial");
    fns.subscribe(mockSub2, "another");

    fns.send("initial");

    expect(mockSub1).not.toHaveBeenCalled();
    expect(mockSub2).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it("should throw error if trigger does not exist in state machine of next state", () => {
    const mockSub1 = mock(() => null);

    fns.subscribe(mockSub1, "initial");

    expect(() => {
      fns.send("outOfInitialState");
    }).toThrow(
      "Unexpected action: 'outOfInitialState' for the state 'initial'"
    );

    expect(mockSub1).not.toHaveBeenCalled();
  });
});
