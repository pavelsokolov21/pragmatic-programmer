import { describe, it, expect, spyOn, mock } from "bun:test";
import { interpret, readFile } from "../interpreter";

const mockReadText = mock();
const mockSelectPen = mock((_arg) => null);
const mockMovePen = mock((_arg) => null);
const mockUpPen = mock((_arg) => null);

describe("readFile", () => {
  it.each([[null], [undefined], [""], [0], [10]])(
    "should throw error if path is invalid",
    (path) => {
      expect(async () => {
        try {
          await readFile(path);
        } catch (err) {
          throw err;
        }
      }).toThrow("Invalid path");
    }
  );

  it("should read file by path", async () => {
    const fileSpy = spyOn(Bun, "file").mockImplementationOnce(() => ({
      text: mockReadText.mockResolvedValueOnce("text"),
    }));

    const text = await readFile("some-path");

    expect(fileSpy).toHaveBeenCalled();
    expect(mockReadText).toHaveBeenCalled();
    expect(text).toBe("text");
  });

  it("should throw not found file error", () => {
    spyOn(Bun, "file").mockImplementationOnce(() => ({
      text: mockReadText.mockRejectedValueOnce("No such file or directory"),
    }));

    expect(async () => {
      try {
        await readFile("some-path");
      } catch (err) {
        throw err;
      }
    }).toThrow("No such file or directory");
  });
});

describe("interpret", () => {
  const program = new Map([
    [
      "A",
      {
        requireArg: true,
        fn: mockSelectPen,
      },
    ],
    [
      "B",
      {
        requireArg: true,
        fn: mockMovePen,
      },
    ],
    [
      "C",
      {
        requireArg: false,
        fn: mockUpPen,
      },
    ],
  ]);
  const interpretWithProgram = interpret(program);

  it("should interpret program valid and call functions", () => {
    interpretWithProgram("A 1\nB 2\nC");

    expect(mockSelectPen).toHaveBeenCalled();
    expect(mockMovePen).toHaveBeenCalled();
    expect(mockUpPen).toHaveBeenCalled();
  });

  it("should interpret program valid and call functions with comments", () => {
    interpretWithProgram("A 1 # comment 1\nB 2 # comment 2\nC # comment 3");

    expect(mockSelectPen).toHaveBeenCalled();
    expect(mockMovePen).toHaveBeenCalled();
    expect(mockUpPen).toHaveBeenCalled();
  });

  it("should throw error on empty argument", () => {
    const fn = () => {
      try {
        interpretWithProgram("A 1\nB\nC");
      } catch (err) {
        throw err;
      }
    };

    expect(fn).toThrow("Command 'B' requires an argument");

    try {
      fn();
    } catch (err) {
      expect(err).toBeInstanceOf(SyntaxError);
    }
  });

  it("should throw error if program has unexpected command", () => {
    const fn = () => {
      try {
        interpretWithProgram("A 1\nB 2\nD");
      } catch (err) {
        throw err;
      }
    };

    expect(fn).toThrow("Command 'D' is unexpected");

    try {
      fn();
    } catch (err) {
      expect(err).toBeInstanceOf(SyntaxError);
    }
  });

  it("should ignore argument if it is not required", () => {
    interpretWithProgram("A 1\nB 2\nC 3");

    expect(mockSelectPen).toHaveBeenCalled();
    expect(mockMovePen).toHaveBeenCalled();
    expect(mockUpPen).toHaveBeenCalled();
  });
});
