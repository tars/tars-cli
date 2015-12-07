'use strict';

var inquirer = require('inquirer');
var tarsUtils = require('../utils');
var tarsConfig = tarsUtils.getTarsConfig();

/**
 * Re-init promt
 * @param  {Function} callback Function to start after promt
 */
module.exports = function reInitPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([{
        type: 'confirm',
        name: 'reinitProject',
        message: 'Attention! Re-init will remove ' + tarsConfig.fs.staticFolderName + ' and pages folder! Continue?',
        default: false
    }], function (answers) {

        if (answers.reinitProject) {
            callback();
            return;
        } else {
            process.stdout.write('^C\n');
            return;
        }
    });
};
