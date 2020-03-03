const chalk = require('chalk');
import { tarsSay } from '../../utils';
import { GENERAL_BUILD_OPTIONS as buildPromtOptions } from '../../constants';

/**
 * General part of command options processing
 * @param  {Object} commandOptions Options for command
 * @return {Array}                 Processed options for TARS task
 */
module.exports = function generalOptionsProcessing(commandOptions: any) {
    let buildOptions = [];

    if (commandOptions.ie8) {
        buildOptions.push(buildPromtOptions.ie8.flag);
        tarsSay(chalk.green('✓ IE8 maintenance.'));
    } else {
        tarsSay(chalk.grey('IE8 maintenance "--ie8".'));
    }

    if (commandOptions.ie9) {
        buildOptions.push(buildPromtOptions.ie9.flag);
        tarsSay(chalk.green('✓ IE9 maintenance.'));
    } else {
        tarsSay(chalk.grey('IE9 maintenance "--ie9".'));
    }

    if (commandOptions.ie) {
        buildOptions.push(buildPromtOptions.ie.flag);
        tarsSay(chalk.green('✓ IE8 and IE9 maintenance.'));
    } else {
        tarsSay(chalk.grey('IE8 and IE9 maintenance "--ie".'));
    }

    if (commandOptions.customFlags) {
        buildOptions = buildOptions.concat(commandOptions.customFlags.split(' '));
        tarsSay(
            `${chalk.green('✓ Custom flags.')} Used custom flags: ${chalk.bold.cyan(commandOptions.customFlags)}`
        );
    } else {
        tarsSay(chalk.grey('Custom flags. "--custom-flags" \'customFlags, with space separator\''));
    }

    return buildOptions;
};
