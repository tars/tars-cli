'use strict';

const inquirer = require('inquirer');
const customFlagsPromt = require('./custom-flags-promt');
const tarsUtils = require('../utils');
const buildPromtOptions = require('../constants').BUILD;
const generateChoices = require('./utils/generateChoices');

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
            choices: generateChoices.generateForCheckboxList(buildPromtOptions)
        }
    ]).then(devAnswers => {
        if (devAnswers.mode.indexOf(buildPromtOptions.customFlags.title) > -1) {
            return customFlagsPromt(devAnswers, callback);
        }

        return callback(devAnswers);
    });
};
