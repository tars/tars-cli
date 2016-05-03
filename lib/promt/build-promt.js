'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const customFlagsPromt = require('./custom-flags-promt');
const tarsUtils = require('../utils');
const buildPromtOptions = require('../constants').BUILD;

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
                    name: buildPromtOptions.release.title,
                    checked: true
                }, {
                    name: buildPromtOptions.min.title
                }, {
                    name: buildPromtOptions.ie9.title
                }, {
                    name: buildPromtOptions.ie8.title
                }, {
                    name: buildPromtOptions.ie.title
                }, {
                    name: buildPromtOptions.customFlags.title
                },
                new inquirer.Separator(chalk.grey('—————————————————————————————'))
            ]
        }
    ]).then(devAnswers => {
        if (devAnswers.mode.indexOf(buildPromtOptions.customFlags.title) > -1) {
            customFlagsPromt(devAnswers, callback);
        } else {
            callback(devAnswers);
        }
    });
};
