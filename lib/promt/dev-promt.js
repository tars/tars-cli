'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const customFlagsPromt = require('./custom-flags-promt');
const tarsUtils = require('../utils');
const devPromtOptions = require('../constants').DEV;

/**
 * Init promt for dev command
 * @param  {Function} callback Function to start after promt
 */
module.exports = function devPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'mode',
            message: 'What mode would you like to use? Available multiple choice.',
            choices: [
                new inquirer.Separator(chalk.grey('—— Press <space> to select ——')),
                {
                    name: devPromtOptions.livereload.title,
                    checked: true
                }, {
                    name: devPromtOptions.tunnel.title
                }, {
                    name: devPromtOptions.ie9.title
                }, {
                    name: devPromtOptions.ie8.title
                }, {
                    name: devPromtOptions.ie.title
                }, {
                    name: devPromtOptions.customFlags.title
                },
                new inquirer.Separator(chalk.grey('—————————————————————————————'))
            ]
        }
    ]).then(devAnswers => {
        if (devAnswers.mode.indexOf(devPromtOptions.customFlags.title) > -1) {
            customFlagsPromt(devAnswers, callback);
        } else {
            callback(devAnswers);
        }
    });
};
