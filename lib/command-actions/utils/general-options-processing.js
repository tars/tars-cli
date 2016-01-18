'use strict';

const chalk = require('chalk');
const tarsUtils = require('../../utils');

/**
 * General part of command options processing
 * @param  {Object} commandOptions Options for command
 * @param  {Object} buildOptions   Options for TARS task
 * @return {Object}                Processed options for TARS task
 */
module.exports = function generalOptionsProcessing(commandOptions, buildOptions) {
    if (commandOptions.ie8) {
        buildOptions.push('--ie8');
        tarsUtils.tarsSay(chalk.green('✓ IE8 maintenance.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('IE8 maintenance "--ie8".'));
    }

    if (commandOptions.ie9) {
        buildOptions.push('--ie9');
        tarsUtils.tarsSay(chalk.green('✓ IE9 maintenance.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('IE9 maintenance "--ie9".'));
    }

    if (commandOptions.ie) {
        buildOptions.push('--ie');
        tarsUtils.tarsSay(chalk.green('✓ IE8 and IE9 maintenance.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('IE8 and IE9 maintenance "--ie".'));
    }

    if (commandOptions.customFlags) {
        buildOptions = buildOptions.concat(commandOptions.customFlags.split(' '));
        tarsUtils.tarsSay(chalk.green('✓ Custom flags.') + ' Used custom flags: ' + chalk.bold.cyan(commandOptions.customFlags));
    } else {
        tarsUtils.tarsSay(chalk.grey('Custom flags. "--custom-flags" \'customFlags, with space separator\''));
    }

    return buildOptions;
};
