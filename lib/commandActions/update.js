'use strict';

var spawn = require('child_process').spawn;
var chalk = require('chalk');
var tarsUtils = require('../utils');

/**
 * Just updates tars-cli dependencies and tars-cli itself
 */
module.exports = function update() {

    var updateLog = spawn('npm', ['update', '-g', 'tars-cli'], {stdio: 'inherit'});

    if (updateLog.stdout) {
        updateLog.stdout.on('data', function (data) {
            process.stdout.write(data.toString());
        });
    }

    updateLog.on('close', function () {
        console.log('\n\n');
        tarsUtils.tarsSay(chalk.green('TARS-CLI has been updated successfully.\n'));
    });
};
