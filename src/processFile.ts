import { path } from "./deps.ts";
import { Config, parseConfig } from "./config.ts";

const moderateRegex = /^([^]*\r?\n)?(\/\/ @?moderate(?: (.*))?)(\r?\n[^]*)$/;

export const modFileRegex = /^mod\.\w+$/;

export const extensions = [".js", ".jsx", ".ts", ".tsx"];

export function hasValidExtension(file: string) {
  return extensions.some((ext) => file.endsWith(ext));
}

export async function processFile(file: string, baseConfig: Config) {
  const content = await Deno.readTextFile(file);
  const moderateMatch = content.match(moderateRegex);
  if (!moderateMatch) return;
  const [
    ,
    header = "",
    moderateComment,
    moderateArgs = "",
    _oldContent,
  ] = moderateMatch;
  const config = parseConfig(moderateArgs.split(" "), baseConfig);
  const dir = path.dirname(file);
  const subFiles = [];
  const subDirs = [];
  const excludeRegexes = config.exclude.map((glob) =>
    path.globToRegExp(glob, { os: "linux" })
  );
  const isExcluded = (file: string) =>
    excludeRegexes.some((regex) => regex.test(file));
  for await (const entry of Deno.readDir(dir)) {
    if (isExcluded(entry.name)) continue;
    if (entry.isDirectory) {
      subDirs.push(entry.name);
    } else if (
      !modFileRegex.test(entry.name) &&
      hasValidExtension(entry.name)
    ) {
      subFiles.push(entry.name);
    }
  }
  subFiles.sort();
  subDirs.sort();
  const subDirMods = (await Promise.all(
    subDirs.map(async (subDir) => {
      for await (const entry of Deno.readDir(path.join(dir, subDir))) {
        if (
          !entry.isDirectory &&
          modFileRegex.test(entry.name) &&
          hasValidExtension(entry.name)
        ) {
          const fullName = path.posix.join(subDir, entry.name);
          if (!isExcluded(fullName)) {
            return fullName;
          }
          break;
        }
      }
      return null!;
    }),
  )).filter((x) => x !== null);
  const newContent = generateContent([...subFiles, ...subDirMods], config);
  await Deno.writeTextFile(file, header + moderateComment + newContent);
  if (!baseConfig.quiet) {
    console.log("Processed file " + file);
  }
}

function generateContent(subFiles: string[], _config: Config) {
  return `\n\n${
    subFiles.map((subFile) => `export * from "./${subFile}";`).join("\n")
  }\n`;
}
