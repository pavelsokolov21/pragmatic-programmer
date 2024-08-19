import { describe, it, expect } from "bun:test";
import { parseIntInRange } from "../parse-int";

describe("parseIntBetweenRange", () => {
  it.each([
    ["18", 18],
    ["150", 150],
    ["100", 100],
  ])("should parse number return valid value %#", (data, expected) => {
    const result = parseIntInRange(data);

    expect(result).toBe(expected);
  });

  it("should throw error if number is invalid", () => {
    expect(() => {
      parseIntInRange("29Str");
    }).toThrow("Number is NaN");
  });

  it.each(["17", "151"])(
    "should throw error if number is out of range",
    (data) => {
      expect(() => {
        parseIntInRange(data);
      }).toThrow("Number is out of range");
    }
  );
});
