'use strict';

const inquirer = require('inquirer');
import { spinner } from '../ui';
import { getTarsProjectVersion, tarsSay, validateFolderName } from '../utils';
const chalk = require('chalk');
const semver = require('semver');

/**
 * Ask about custom path
 * @param  {Object} answers     Answers from promt
 * @param  {Function} callback  Function to start after promt
 */
module.exports = function customPathPromt(answers: any, callback: any) {
    spinner.stop(true);

    const currentTarsVersion = getTarsProjectVersion();

    if (semver.cmp(currentTarsVersion, '<', '1.8.0')) {
        answers.customPath = '';
        tarsSay(chalk.yellow('Custom path for component is not supported in TARS, which is used in current project!'));
        tarsSay('Run "tars update-project" to get the latest version of TARS.');

        return callback(answers);
    }

    inquirer.prompt([
        {
            type: 'input',
            name: 'customPath',
            message: 'Input custom path without any quotes (Example: component1/component2):',
            validate: validateFolderName
        }
    ]).then((pathAnswers: any) => {
        answers.customPath = pathAnswers.customPath.replace(/\/$/, '') || '';
        callback(answers);
    });
};
