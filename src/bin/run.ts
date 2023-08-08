#!/usr/bin/env node
import childProcess from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import yargs from 'yargs'

const jscodeshiftPackage = require("jscodeshift/package.json");
const jscodeshiftDirectory = path.dirname(require.resolve("jscodeshift"));

const jscodeshiftExecutable = path.join(
  jscodeshiftDirectory,
  jscodeshiftPackage.bin.jscodeshift
);

async function runTransform(files, flags, codemodFlags) {
  const transformerSrcPath = path.resolve(
    __dirname,
    "../transforms/graphql-function-invidual-to-object-argument.js"
  );
  let transformerPath;
  try {
    await fs.stat(transformerSrcPath);
    transformerPath = transformerSrcPath;
  } catch (srcPathError) {
    throw new Error(
      `Transform is not found. Check out ${path.resolve(
        __dirname,
        "./README.md for a list of available codemods."
      )}`
    );
  }

  const args = [
    // can't directly spawn `jscodeshiftExecutable` due to https://github.com/facebook/jscodeshift/issues/424
    jscodeshiftExecutable,
    "--transform",
    transformerPath,
    ...codemodFlags,
    "--extensions",
    "js,ts",
    "--ignore-pattern",
    "**/node_modules/**",
  ];

  if (flags.dry) {
    args.push("--dry");
  }
  if (flags.print) {
    args.push("--print");
  }
  if (flags.jscodeshift) {
    args.push(flags.jscodeshift);
  }

  args.push(...files);

   
  console.log(`Executing command: jscodeshift ${args.join(" ")}`);
  const jscodeshiftProcess = childProcess.spawnSync("node", args, {
    stdio: "inherit",
  });

  if (jscodeshiftProcess.error) {
    throw jscodeshiftProcess.error;
  }
}

function run(argv) {
  const { paths, ...flags } = argv;

  return runTransform(
    paths.map((filePath) => path.resolve(filePath)),
    flags,
    argv._
  );
}

yargs
  .command({
    command: "$0 <paths...>",
    describe:
      "Applies a graphql-js-invidual-to-object-argument to the specified paths",
    builder: (command) => {
      return command
        .positional("paths", {
          array: true,
          description: "Paths forwarded to `jscodeshift`",
          type: "string",
        })
        .option("dry", {
          description: "dry run (no changes are made to files)",
          default: false,
          type: "boolean",
        })
        .option("parser", {
          description: "which parser for jscodeshift to use",
          default: "tsx",
          type: "string",
        })
        .option("print", {
          description:
            "print transformed files to stdout, useful for development",
          default: false,
          type: "boolean",
        })
        .option("jscodeshift", {
          description: "(Advanced) Pass options directly to jscodeshift",
          default: false,
          type: "string",
        });
    },
    handler: run,
  })
  .scriptName("npx graphql-js-invidual-to-object-argument")
  .example("$0 src")
  .example("$0 src -- --component=Grid --from=prop --to=newProp")
  .help()
  .parse();
