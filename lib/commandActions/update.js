'use strict';

var spawn = require('win-spawn');
var chalk = require('chalk');
var tarsUtils = require('../utils');
var pty;

if (!tarsUtils.isWindows()) {
    pty = require('pty.js');
}

/**
 * Just updates tars-cli dependencies and tars-cli itself
 */
module.exports = function update() {
    var term;

    tarsUtils.spinner.start();

    if (tarsUtils.isWindows()) {
        term = spawn('npm', ['update', '-g', 'tars-cli'], {stdio: 'inherit'});
        tarsUtils.spinner.stop(true);
    } else {
        term = pty.spawn('npm', ['update', '-g', 'tars-cli']);

        term.on('data', function (data) {
            tarsUtils.spinner.stop(true);
            process.stdout.write(data.toString());
        });

        term.on('close', function () {
            tarsUtils.spinner.stop(true);
            console.log('\n\n');
            tarsUtils.tarsSay(chalk.green('TARS-CLI has been updated successfully.\n'), true);
        });
    }
};
