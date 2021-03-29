#!/usr/bin/env node
const { execSync } = require("child_process");
const [preset, moduleName] = process.argv.slice(2);

const config = require("./dojlid.config.js");

config.presets[preset](moduleName);

execSync(config.format(moduleName));