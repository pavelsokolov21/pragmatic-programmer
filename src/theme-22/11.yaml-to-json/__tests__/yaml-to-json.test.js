import { describe, it, expect } from "bun:test";
import { unlinkSync } from "node:fs";
import { yamlToJSON } from "../yaml-to-json";
import { readFile } from "../../../utils/read-file";

const PATH = import.meta.dir;
const TEST_JSON_FILE_NAME = "test.json";

describe("yamlToJSON", () => {
  it("should convert yaml to json", async () => {
    try {
      await yamlToJSON(PATH);

      const json = await readFile(`${PATH}/${TEST_JSON_FILE_NAME}`).json();

      unlinkSync(`${PATH}/${TEST_JSON_FILE_NAME}`);

      expect(json).toEqual({
        name: "Pavel Sokolov",
        age: 23,
        city: "Tver",
        arr: ["foo", "bar"],
        obj: {
          field1: "value1",
        },
      });
    } catch (err) {
      console.error(err);
      // To fail test
      expect(true).toBeFalse();
    }
  });
});
