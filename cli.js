#!/usr/bin/env node
const { execSync } = require("child_process");
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

(async () => {
  const parser = yargs(hideBin(process.argv))
    // preset
    .describe("p", "select preset")
    .nargs("p", 1)
    .demandOption(['p'], "preset is required")
    // setup
    .describe("setup", "creates layer to enable feature addition")
    .nargs("setup", 0)
    // name
    .describe('c', 'plugin command')
    .nargs('c', 1)
    // name
    .describe('n', 'name of affected module')
    .nargs('n', 1);
  try {
    const argv = await parser.parse();
    const config = require(`${process.cwd()}/dojlid.config.js`);
    const preset = config.presets[argv.p];
    if (!preset) {
      console.log(`preset "${argv.p}" not found.`);
      process.exit();
    }
    if (argv.setup) {
        preset.commands["setup"]();
    } else {
        preset.commands[argv.c || preset.defaultCommand](argv.n, argv);
    }
    execSync(config.format());
  } catch (err) {
    console.info("err:", err);
  }
})();
