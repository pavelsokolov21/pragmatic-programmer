export const readFile = async (path) => {
  if (typeof path !== "string" || path.length === 0) {
    throw new Error("Invalid path");
  }

  const file = Bun.file(path);
  const text = await file.text();

  return text;
};

export const interpret = (program) => (file) => {
  file.split("\n").forEach((line) => {
    const [name, arg] = line.split("#")[0].split(" ");
    const configuration = program.get(name);

    if (!configuration) {
      throw SyntaxError(`Command '${name}' is unexpected`);
    }

    if (configuration.requireArg && isNaN(arg)) {
      throw SyntaxError(`Command '${name}' requires an argument`);
    }

    const args = configuration.requireArg ? [Number(arg)] : [];
    configuration.fn.apply(null, args);
  });
};

const start = async () => {
  const testPath = "theme-14/4.syntax-analyzer/language.txt";
  const program = new Map([
    [
      "P",
      {
        requireArg: true,
        fn: (arg) => console.log(`Выбрано перо "${arg}"`),
      },
    ],
    [
      "D",
      {
        requireArg: false,
        fn: () => console.log("Перо опущено"),
      },
    ],
    [
      "W",
      {
        requireArg: true,
        fn: (arg) =>
          console.log(`Нарисована линия ${arg}см в западном направлении`),
      },
    ],
    [
      "N",
      {
        requireArg: true,
        fn: (arg) =>
          console.log(`Нарисована линия ${arg}см в северном направлении`),
      },
    ],
    [
      "E",
      {
        requireArg: true,
        fn: (arg) =>
          console.log(`Нарисована линия ${arg}см в восточном направлении`),
      },
    ],
    [
      "S",
      {
        requireArg: true,
        fn: (arg) =>
          console.log(`Нарисована линия ${arg}см в южном направлении`),
      },
    ],
    [
      "U",
      {
        requireArg: false,
        fn: () => console.log("Перо поднято"),
      },
    ],
  ]);
  const interpretWithProgram = interpret(program);

  try {
    const text = await readFile(testPath);

    interpretWithProgram(text);
  } catch {
    console.log("Something went wrong");
  }
};

start();
