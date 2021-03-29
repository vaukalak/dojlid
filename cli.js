#!/usr/bin/env node
const { execSync } = require("child_process");
const [preset, moduleName] = process.argv.slice(2);

console.log("dirname", __dirname);
console.log("cwd", process.cwd());

const config = require(`${process.cwd()}/dojlid.config.js`);

config.presets[preset](moduleName);

execSync(config.format(moduleName));