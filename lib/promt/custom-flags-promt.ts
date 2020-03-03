const inquirer = require('inquirer');
const chalk = require('chalk');
import { spinner } from '../ui';
import { tarsSay } from '../utils';

/**
 * Ask about custom flags
 * @param  {Object} answers     Answers from promt
 * @param  {Function} callback  Function to start after promt
 */
module.exports = function customFlagsPromt(answers: any, callback: any) {
    spinner.stop(true);

    inquirer.prompt([
        {
            type: 'input',
            name: 'customFlags',
            message: 'Input custom flags with space separator without any quotes:'
        }
    ]).then((flagsAnswers: any) => {
        answers.customFlags = flagsAnswers.customFlags.split(' ');
        // @ts-ignore
        tarsSay(`Used custom flags: ${chalk.bold.cyan(answers.customFlags.join(', '))}`);
        callback(answers);
    });
};
