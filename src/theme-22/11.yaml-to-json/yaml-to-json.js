import { Glob } from "bun";
import yaml from "js-yaml";
import { readFile } from "../../utils/read-file";

const splitFileAndPath = (path) => {
  const pathWithoutFile = path.split("/");
  const fileName = pathWithoutFile.pop();

  return [pathWithoutFile.join("/"), fileName];
};

export const yamlToJSON = (path = ".") => {
  const glob = new Glob("**/*.yaml");

  return Promise.all(
    Array.from(glob.scanSync(path))
      .filter((fileName) => !/__tests__/.test(fileName))
      .map(async (fileName) => {
        const fullPath = `${path}/${fileName}`;
        const yamlContent = await readFile(fullPath).text();
        const jsonData = yaml.load(yamlContent);
        const jsonContent = JSON.stringify(jsonData, null, 2);
        const [pathWithoutFile, name] = splitFileAndPath(fileName);
        const fileNameWithoutExtension = name.match(/(.*)\.[^.]+$/)[1];

        await Bun.write(
          `${path}/${pathWithoutFile}/${fileNameWithoutExtension}.json`,
          jsonContent
        );
      })
  );
};
