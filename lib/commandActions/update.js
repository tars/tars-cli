'use strict';

var pty = require('pty.js');
var chalk = require('chalk');
var tarsUtils = require('../utils');

/**
 * Just updates tars-cli dependencies and tars-cli itself
 */
module.exports = function update() {
    var term = pty.spawn('npm', ['update', '-g', 'tars-cli']);

    tarsUtils.spinner.start();

    term.on('data', function(data) {
        tarsUtils.spinner.stop(true);
        setTimeout(function () {
            process.stdout.write(data.toString());
        }, 100);
    });

    term.on('close', function(data) {
        console.log('\n\n');
        tarsUtils.tarsSay(chalk.green('TARS-CLI has been updated successfully.\n'), true);
    });
};
