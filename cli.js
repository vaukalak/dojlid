#!/usr/bin/env node
const { execSync } = require("child_process");
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const inquirer = require('inquirer');
const { query } = require("./dist/effects/query");

function* getPreset(config) {
  const options = Object.keys(config.presets).map(value => ({ value }));
  const q = { type: "selector", options };
  const presetName = yield query("p", q, "Select preset");
  return config.presets[presetName];
}

function* dojlidWorker({ config }) {
  const preset = yield* getPreset(config);
  if (preset.install) {
    yield* preset.install();
  }
  const setup = yield query("setup", { type: "boolean" }, "Is setup?", ["interactive-cli"]);
  if (setup) {
    preset.commands["setup"]();
  } else {
    const options = Object.keys(preset.commands).map(value => ({ value }));
    const q = { type: "selector", options, defaultOption: preset.defaultCommand };
    const command = yield query("c", q, "Select a command");
    yield* preset.commands[command]();
  }
}

const cliParamsProvider = (argv) => (context) => {
  return {
    provide: (query) => {
      return argv[query.name];
    },
  };
};

const interactiveCliProvider = (context) => {
  return {
    provide: async (effect) => {
      
      if (effect.skip.includes("interactive-cli")) {
        return undefined;
      }
      switch (effect.query.type) {
        case "selector": {
          const { options } = effect.query;
          const { option } = await inquirer
            .prompt([
              {
                type: 'list',
                name: 'option',
                message: effect.label,
                choices: options.map(o => o.label || o.value),
              }
            ]);
          const selected = options.find(({ value }) => value === option)
            || options.find(({ label }) => label === option);
          return selected.value;
        }
        case "boolean": {
          const { option } = await inquirer
            .prompt([
              {
                type: 'list',
                name: 'option',
                message: effect.label,
                choices: ["Yes", "No"],
              }
            ]);
          // process.stdout.moveCursor(0, -1) // up one line
          // process.stdout.clearLine(1) // from cursor to end
          return option === "Yes";
        }
        case "string": {
          const { option } = await inquirer
          .prompt([
            {
              type: 'input',
              name: 'option',
              message: effect.label,
            }
          ]);
          // process.stdout.moveCursor(0, -1) // up one line
          // process.stdout.clearLine(1) // from cursor to end
          return option;
        }
      }
    }
  };
};

const runWorker = async (worker, context) => {
  let next = worker.next();
  while (true) {
    if (next.done) {
      return next.value;
      break;
    }
    const nextValue = await runEffect(next.value, context);
    next = worker.next(nextValue);
  }
}

const runEffect = async (effect, context) => {
  switch (effect.effectType) {
    case "QUERY": {
      if (context.knownQueries[effect.name]) {
        return context.knownQueries[effect.name];
      }
      for (const provider of context.providers) {
        const value = await provider(context).provide(effect);
        if (value) {
          context.knownQueries[effect.name] = value;
          return value;
        }
      }
      break;
    }
    case "SUBSCRIBE": {
      const eventSubscriptions = context.subscriptions[effect.event] || [];
      eventSubscriptions.push(effect.handler);
      context.subscriptions[effect.event] = eventSubscriptions;
      break;
    }
    case "DISPATCH": {
      return await Promise.all(
        (context.subscriptions[effect.event] || []).map(
          subscription => runWorker(subscription(effect.payload), context)
        )
      );
      break;
    }
  }
}

const runDojlid = async (context) => {
  await runWorker(dojlidWorker(context), context);
};

(async () => {
  const parser = yargs(hideBin(process.argv))
    // preset
    .describe("p", "select preset")
    .nargs("p", 1)
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
    const context = {
      knownQueries: {},
      subscriptions: {},
      config,
      providers: [
        cliParamsProvider(argv),
        interactiveCliProvider,
      ],
    };  
    await runDojlid(context);
    execSync(config.format());
  } catch (err) {
    console.info("err:", err);
  }
})();
