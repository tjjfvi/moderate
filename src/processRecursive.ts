import { Config } from "./config.ts";
import { path } from "./deps.ts";
import { hasValidExtension, modFileRegex, processFile } from "./processFile.ts";

export async function processRecursive(base: string, config: Config) {
  if ((await Deno.stat(base)).isDirectory) {
    return processDirectory(base, config);
  } else {
    return processFile(base, config);
  }
}

export async function processDirectory(base: string, config: Config) {
  const promises = [];
  for await (const entry of Deno.readDir(base)) {
    if (entry.isDirectory) {
      promises.push(processDirectory(path.join(base, entry.name), config));
    } else if (modFileRegex.test(entry.name) && hasValidExtension(entry.name)) {
      promises.push(processFile(path.join(base, entry.name), config));
    }
  }
}
