import { it, describe, expect } from "bun:test";
import {
  dateAnalyze,
  parseHour,
  parseAmPm,
  parseMinute,
  calculateMinutesAmPm,
  calculateMinutes,
  isValidAmPmDate,
  isValidDate,
} from "../analyzer";

describe("isValidAmPmDate", () => {
  it.each([
    "4am",
    "4pm",
    "4:00am",
    "4:00pm",
    "4:22pm",
    "4:22am",
    "11:00am",
    "11:00pm",
    "12:00am",
    "12:00pm",
  ])("should return true if date is valid %#", (data) => {
    const result = isValidAmPmDate(data);

    expect(result).toBeTrue();
  });

  it.each(["13am", "13pm", "pm13", "4:62am", "5amm", "4::00pm", ":4:00pm"])(
    "should return false if date is invalid %#",
    (data) => {
      const result = isValidAmPmDate(data);

      expect(result).toBeFalse();
    }
  );
});

describe("isValidDate", () => {
  it.each(["4:00", "4:22", "23:59", "0:00"])(
    "should return true if date is valid %#",
    (data) => {
      const result = isValidDate(data);

      expect(result).toBeTrue();
    }
  );

  it.each([
    "13am",
    "24:00",
    "31:00",
    "13:60",
    "13:62",
    "4:00am",
    "4::00",
    ":4:00",
  ])("should return false if date is invalid %#", (data) => {
    const result = isValidDate(data);

    expect(result).toBeFalse();
  });
});

describe("parseHour", () => {
  it.each([
    ["1", 1],
    ["10", 10],
    ["23", 23],
  ])("should parse hour valid %#", (data, expected) => {
    const result = parseHour(data);

    expect(result).toBe(expected);
  });

  it.each(["24", "-1", "55"])(
    "should validate hour and throw error %#",
    (data) => {
      expect(() => {
        parseHour(data);
      }).toThrow("Invalid hour");
    }
  );
});

describe("parseMinute", () => {
  it.each([
    ["1", 1],
    ["10", 10],
    ["23", 23],
  ])("should parse minute valid", (data, expected) => {
    const result = parseMinute(data);

    expect(result).toBe(expected);
  });

  it.each(["60", "-1", "70"])(
    "should validate minute and throw error %#",
    (data) => {
      expect(() => {
        parseMinute(data);
      }).toThrow("Invalid minutes");
    }
  );
});

describe("parseAmPm", () => {
  it.each([
    ["am", "am"],
    ["Am", "am"],
    ["aM", "am"],
    ["AM", "am"],
    ["pm", "pm"],
    ["PM", "pm"],
    ["Pm", "pm"],
    ["pM", "pm"],
  ])("should parse am/pm valid %#", (data, expected) => {
    const result = parseAmPm(data);

    expect(result).toBe(expected);
  });

  it("should validate ampm and throw error", () => {
    expect(() => {
      parseAmPm("foo");
    }).toThrow("Invalid am/pm indicator");
  });
});

describe("calculateMinutesAmPm", () => {
  it.each([
    [[1, 10, "am"], 70],
    [[1, 0, "pm"], 780],
    [[12, 0, "am"], 0],
    [[12, 0, "pm"], 720],
  ])("should calculate minutes by am/pm %#", (data, expected) => {
    const result = calculateMinutesAmPm.apply(null, data);

    expect(result).toBe(expected);
  });
});

describe("calculateMinutes", () => {
  it.each([
    [[1, 0], 60],
    [[1, 10], 70],
  ])("should calculate minutes %#", (data, expected) => {
    const result = calculateMinutes.apply(null, data);

    expect(result).toBe(expected);
  });
});

describe("dateAnalyze", () => {
  it.each([
    ["4pm", 960],
    ["4am", 240],
    ["11am", 660],
    ["7:38pm", 1178],
    ["3:16pm", 916],
    ["3:16am", 196],
    ["23:42", 1422],
    ["3:16", 196],
  ])("should calc minutes from 0:00 %#", (data, expected) => {
    const result = dateAnalyze(data);

    expect(result).toBe(expected);
  });

  it.each(["pm4", "am4", "4am:10", "4:am10", "4::10", "4:10:"])(
    "should validate time and throw error %#",
    (data) => {
      expect(() => {
        dateAnalyze(data);
      }).toThrow("Invalid date structure");
    }
  );
});
