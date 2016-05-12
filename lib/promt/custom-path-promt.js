'use strict';

const inquirer = require('inquirer');
const tarsUtils = require('../utils');

/**
 * Ask about custom path
 * @param  {Object} answers     Answers from promt
 * @param  {Function} callback  Function to start after promt
 */
module.exports = function customPathPromt(answers, callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'input',
            name: 'customPath',
            message: 'Input custom path without any quotes (Example: component1/component2):',
            validate: tarsUtils.validateFolderName
        }
    ]).then(pathAnswers => {
        answers.customPath = pathAnswers.customPath.replace(/\/$/, '') || '';
        callback(answers);
    });
};
