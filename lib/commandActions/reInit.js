'use strict';

var chalk = require('chalk');
var tarsUtils = require('../utils');
var spawn = require('win-spawn');
var term = {};
var pty;

if (!tarsUtils.isWindows()) {
    pty = require('pty.js');
}

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

    if (tarsUtils.isWindows()) {
        term = spawn('gulp', ['re-init', '--silent'], {stdio: 'inherit'});
        tarsUtils.spinner.stop(true);
    } else {
        term = pty.spawn('gulp', ['re-init', '--silent']);

        term.on('data', function(data) {
            tarsUtils.spinner.restart(true);
            process.stdout.write(data.toString());
        });

        term.on('close', function(data) {
            tarsUtils.spinner.stop(true);
        });
    }
};
