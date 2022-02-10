import { yargs } from "./deps.ts";

export interface Config {
  exclude: string[];
  quiet?: boolean;
}

export function configYargs(args: string[]) {
  return yargs(args)
    .option("quiet", {
      alias: "q",
      type: "boolean",
      description: "Suppress all output",
    })
    .option("exclude", {
      alias: "x",
      type: "array",
      description: "Exclude files from generated mod.ts (glob)",
    });
}

export function yargvToConfig(argv: any): Config {
  return {
    exclude: argv.exclude ?? [],
    quiet: argv.quiet,
  };
}

export function mergeConfig(base: Config, override: Config): Config {
  return {
    exclude: [...base.exclude, ...override.exclude ?? []],
    quiet: override.quiet ?? base.quiet,
  };
}

export function parseConfig(args: string[], base: Config): Config {
  const parsed = configYargs(args)
    .option("override", {
      type: "boolean",
      description: "Override default config",
    })
    .parse();
  if (parsed.override) {
    return yargvToConfig(parsed);
  } else {
    return mergeConfig(base, yargvToConfig(parsed));
  }
}
