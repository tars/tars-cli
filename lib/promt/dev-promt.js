'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const customFlagsPromt = require('./custom-flags-promt');
const tarsUtils = require('../utils');

/**
 * Init promt for dev command
 * @param  {Function} callback Function to start after promt
 */
module.exports = function devPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt({
        type: 'checkbox',
        name: 'mode',
        message: 'What mode would you like to use? Available multiple choice.',
        choices: [
            new inquirer.Separator(chalk.grey('—— Press <space> to select ——')),
            {
                name: ' Start server for livereload',
                checked: true
            }, {
                name: ' Start server for tunnel and livereload'
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
    }, devAnswers => {
        if (devAnswers.mode.indexOf(' Custom flags') > -1) {
            customFlagsPromt(devAnswers, callback);
        } else {
            callback(devAnswers);
        }
    });
};
