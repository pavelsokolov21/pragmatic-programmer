import { describe, it, expect } from "bun:test";
import { readFile } from "../../../utils/read-file";
import {
  replaceByRange,
  replaceDeclarationToSnakeCase,
  getAst,
} from "../12.camel-case-to-snake-case";

const DATA_FOLDER = `${__dirname}/data`;

describe("spliceStr", () => {
  it("should replace slice in str", () => {
    const result = replaceByRange("foo bar bazz")("newBar", 4, 7);

    expect(result).toBe("foo newBar bazz");
  });

  it("should replace to end of string by default", () => {
    const result = replaceByRange("foo bar bazz")("newBar", 4);

    expect(result).toBe("foo newBar");
  });

  it("should replace from start to end by default", () => {
    const result = replaceByRange("foo bar bazz")("newBar");

    expect(result).toBe("newBar");
  });
});

describe("replaceDeclarationToSnakeCase", () => {
  it("should replace camelCase to snake_case in simple code", () => {
    const code = "const camelCase = 10;";
    const ast = getAst(code);
    const result = replaceDeclarationToSnakeCase(ast)(code);

    expect(result).toBe("const camel_case = 10;");
  });

  it("should replace camelCase in function", async () => {
    const fileTest = readFile(
      Bun.resolveSync("./fn-parse-test-initial.js", DATA_FOLDER)
    );
    const textTest = await fileTest.text();
    const ast = getAst(textTest);
    const result = replaceDeclarationToSnakeCase(ast)(textTest);

    const fileExpected = readFile(
      Bun.resolveSync("./fn-parse-test-expected.js", DATA_FOLDER)
    );
    const textExpected = await fileExpected.text();

    expect(result).toBe(textExpected);
  });
});
