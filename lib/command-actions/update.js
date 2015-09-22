'use strict';

var chalk = require('chalk');
var runCommand = require('./utils/run-command');
var tarsUtils = require('../utils');

/**
 * Just updates tars-cli dependencies and tars-cli itself
 */
module.exports = function update() {
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline('TARS-CLI update has been started!'));
    tarsUtils.tarsSay('Make a cup of tea/coffee, while it is working:)');
    runCommand('npm', ['update', '-g', 'tars-cli'], {
        onCloseActions: function () {
            console.log('\n\n');
            tarsUtils.tarsSay(chalk.green('TARS-CLI has been updated successfully.\n'), true);
        }
    });
};
