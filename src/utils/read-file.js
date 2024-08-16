export const readFile = (path) => {
  if (typeof path !== "string" || path.length === 0) {
    throw new Error("Invalid path");
  }

  return Bun.file(path);
};
