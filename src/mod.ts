#!/usr/bin/env -S deno run --allow-read --allow-write --no-check

import { configYargs, yargvToConfig } from "./config.ts";
import { processRecursive } from "./processRecursive.ts";

if (import.meta.main) {
  main();
}

export async function main() {
  const argv = configYargs(Deno.args)
    .usage("moderate [options] <paths>")
    .parse();
  const config = yargvToConfig(argv);
  const files = argv._.length ? argv._ : ".";
  await Promise.all(argv._.map((x: string) => processRecursive(x, config)));
}

// moderate --exclude deps.ts

export * from "./config.ts";
export * from "./processFile.ts";
export * from "./processRecursive.ts";
