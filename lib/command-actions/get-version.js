'use strict';

var chalk = require('chalk');
var tarsUtils = require('../utils');
var updateNotifier = require('update-notifier');

/**
 * Get version of tars-cli
 */
module.exports = function getVersion() {
    var packageInfo = require(process.env.cliRoot + 'package.json');
    var notifier = updateNotifier({
        pkg: packageInfo,
        updateCheckInterval: 1000 * 60 * 60 * 24
    });

    console.log('\n');
    tarsUtils.tarsSay('Tars-cli version: ' + chalk.cyan('"' + packageInfo.version + '"'), true);

    if (notifier.update) {
        tarsUtils.tarsSay('Update available! New version: ' + notifier.update.latest, true);
        tarsUtils.tarsSay('Run the command ' + chalk.cyan.bold('"tars update"') + ' to update TARS-cli. \n', true);
    }
};
