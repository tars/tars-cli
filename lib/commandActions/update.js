'use strict';

var exec = require('child_process').exec;
var chalk = require('chalk');
var tarsUtils = require('../utils');

/**
 * Just updates tars-cli dependencies and tars-cli itself
 */
module.exports = function update() {
    exec('npm update -g tars-cli', function (error, stdout, stderr) {
        if (error) {
            console.log(stderr);
        } else {
            console.log(stdout);
            console.log('\n\n');
            tarsUtils.tarsSay(chalk.green('TARS-CLI has been updated successfully.\n'));
        }
    });
};
