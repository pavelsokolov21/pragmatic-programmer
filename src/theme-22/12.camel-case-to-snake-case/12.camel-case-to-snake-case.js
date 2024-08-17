import { Parser } from "acorn";
import { readFile } from "../../utils/read-file";

const LINE_TYPES = {
  VARIABLE_DECLARATION: "VariableDeclaration",
  FUNCTION_DECLARATION: "FunctionDeclaration",
  RETURN_STATEMENT: "ReturnStatement",
};

export const replaceByRange =
  (str) =>
  (repl, start = 0, end = str.length) =>
    str.substring(0, start) + repl + str.substring(end);

export const camelCaseToSnakeCase = (text) =>
  text
    .split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();

/**
 * ЭТО САМЫЙ ПРИМИТИВНЫЙ ПАРСЕР!
 * Тут не обработаны многие условности, например, работа с ifStatement, loop, ReturnStatement и прочее.
 * Задача была познакомиться с AST и как базово можно его применить
 */
export const replaceDeclarationToSnakeCase = (ast) => (fileText) => {
  let newFileText = fileText;
  const replaceByRangeWithStr = replaceByRange(newFileText);

  function inner(innerAst) {
    const body = innerAst.body;

    if (Array.isArray(body)) {
      body.forEach((line) => {
        if (line.type === LINE_TYPES.VARIABLE_DECLARATION) {
          line.declarations.forEach(({ id: { start, end } }) => {
            const newName = camelCaseToSnakeCase(newFileText.slice(start, end));

            newFileText = replaceByRangeWithStr(newName, start, end);
          });
        }

        if (line.type === LINE_TYPES.FUNCTION_DECLARATION) {
          inner(line.body);
        }
      });
    }
  }

  inner(ast);

  return newFileText;
};

export const getAst = (text) => Parser.parse(text, { ecmaVersion: 2020 });

export const convertDeclarationnToSnakeCase = async (filePath) => {
  const file = readFile(Bun.resolveSync(filePath, __dirname));
  const text = await file.text();
  const ast = getAst(text);
};

convertDeclarationnToSnakeCase("./test.js");
