#!/usr/bin/env node
import commander from 'commander';
import { CommanderStatic } from 'commander';
import { CommandLoader } from '../commands';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const cliRootPath = path.resolve(__dirname, '../../');
let npmRootPath = path.join(cliRootPath, 'node_modules/');

try {
  fs.statSync(npmRootPath);
} catch (error) {
  npmRootPath = path.resolve(cliRootPath, '../') + path.sep;
}

// Get root npm directory for global packages and create env-var with it.
process.env.cliRoot = cliRootPath;
process.env.npmRoot = npmRootPath;

const program: CommanderStatic = commander;

program.usage(
  '[command] [options] \n         Command without flags will be started in interactive mode.',
);

if (!args.length) {
  program.outputHelp();
}

CommandLoader.load(program);

program.parse(process.argv);
