'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const customFlagsPromt = require('./custom-flags-promt');
const tarsUtils = require('../utils');

/**
 * Init promt for build command
 * @param  {Function} callback Function to start after promt
 */
module.exports = function buildPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'mode',
            message: 'What mode would you like to use? Available multiple choice.',
            choices: [
                new inquirer.Separator(chalk.grey('—— Press <space> to select ——')),
                {
                    name: ' Release mode',
                    checked: true
                }, {
                    name: ' Minify files only'
                }, {
                    name: ' IE9 maintenance'
                }, {
                    name: ' IE8 maintenance'
                }, {
                    name: ' IE8 and IE9 maintenance'
                }, {
                    name: ' Custom flags'
                },
                new inquirer.Separator(chalk.grey('—————————————————————————————'))
            ]
        }
    ]).then(devAnswers => {
        if (devAnswers.mode.indexOf(' Custom flags') > -1) {
            customFlagsPromt(devAnswers, callback);
        } else {
            callback(devAnswers);
        }
    });
};
