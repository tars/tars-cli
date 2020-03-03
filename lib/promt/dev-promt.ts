const inquirer = require('inquirer');
const customFlagsPromt = require('./custom-flags-promt');
import { spinner } from '../ui';
import { DEV as devPromtOptions } from '../constants';
const generateChoices = require('./utils/generateChoices');

/**
 * Init promt for dev command
 * @param  {Function} callback Function to start after promt
 */
module.exports = function devPromt(callback: any) {
    spinner.stop(true);

    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'mode',
            message: 'What mode would you like to use? Available multiple choice.',
            choices: generateChoices.generateForCheckboxList(devPromtOptions)
        }
    ]).then((devAnswers: any) => {
        if (devAnswers.mode.indexOf(devPromtOptions.customFlags.title) > -1) {
            return customFlagsPromt(devAnswers, callback);
        }

        return callback(devAnswers);
    });
};
