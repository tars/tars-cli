'use strict';

const inquirer = require('inquirer');
const customFlagsPromt = require('./custom-flags-promt');
const tarsUtils = require('../utils');
const devPromtOptions = require('../constants').DEV;
const generateChoices = require('./utils/generateChoices');

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
            choices: generateChoices.generateForCheckboxList(devPromtOptions)
        }
    ]).then(devAnswers => {
        if (devAnswers.mode.indexOf(devPromtOptions.customFlags.title) > -1) {
            return customFlagsPromt(devAnswers, callback);
        }

        return callback(devAnswers);
    });
};
