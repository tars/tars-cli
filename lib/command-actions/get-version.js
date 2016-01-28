'use strict';

const chalk = require('chalk');
const tarsUtils = require('../utils');
const updateNotifier = require('update-notifier');

/**
 * Get version of tars-cli
 */
module.exports = function getVersion() {
    const packageInfo = require(`${process.env.cliRoot}package.json`);
    const notifier = updateNotifier({
        pkg: packageInfo,
        updateCheckInterval: 1000 * 60 * 60
    });
    const tarsProjectVersion = tarsUtils.getTarsProjectVersion();

    console.log('\n');
    tarsUtils.tarsSay('Tars-cli version: ' + chalk.cyan('"' + packageInfo.version + '"'), true);

    if (tarsProjectVersion) {
        tarsUtils.tarsSay('Tars version in current project: ' + chalk.cyan('"' + tarsProjectVersion + '"'), true);
    }

    if (notifier.update && packageInfo.version.toString() !== notifier.update.latest.toString()) {
        tarsUtils.tarsSay(`Update available! New version: ${notifier.update.latest}`, true);
        tarsUtils.tarsSay(`Run the command ${chalk.cyan.bold('"tars update"')} to update TARS-cli. \n`, true);
    }
};
