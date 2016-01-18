'use strict';

const inquirer = require('inquirer');
const tarsUtils = require('../utils');
const tarsConfig = tarsUtils.getTarsConfig();

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
    }], answers => {

        if (answers.reinitProject) {
            callback();
            return;
        }

        process.stdout.write('^C\n');
        return;
    });
};
