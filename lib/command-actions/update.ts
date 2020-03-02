'use strict';

const chalk = require('chalk');
const runCommand = require('./utils/run-command');
const execSync = require('child_process').execSync;
const tarsUtils = require('../utils');

/**
 * Just updates tars-cli dependencies and tars-cli itself
 */
module.exports = function update() {
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline('TARS-CLI update has been started!'));
    tarsUtils.tarsSay('Make a cup of tea/coffee, while it is working :)');
    execSync('npm cache clean --force');
    runCommand('npm', ['update', '-g', 'tars-cli']);
};
