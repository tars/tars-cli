'use strict';

var pty = require('pty.js');
var chalk = require('chalk');
var tarsUtils = require('../utils');
var term = {};

/**
 * Start re-init task in gulp
 */
module.exports = function reInit() {

    // If we are not in TARS directory or TARS has not been inited
    if (!tarsUtils.isTarsInited()) {
        tarsUtils.tarsNotInitedActions();
        return;
    }

    tarsUtils.spinner.start();

    console.log('\n');
    tarsUtils.tarsSay(chalk.underline('Reinitialization task has been started!') + '\n');

    term = pty.spawn('gulp', ['re-init', '--silent']);

    term.on('data', function(data) {
        tarsUtils.spinner.restart(true);
        process.stdout.write(data.toString());
    });

    term.on('close', function(data) {
        tarsUtils.spinner.stop(true);
    });
};
