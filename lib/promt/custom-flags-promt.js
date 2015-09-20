'use strict';

var fs = require('fs');
var inquirer = require('inquirer');
var chalk = require('chalk');
var customFlagsPromt = require('./custom-flags-promt');
var tarsUtils = require('../utils');

/**
 * Ask about custom flags
 * @param  {Function} callback Function to start after promt
 */
module.exports = function customFlagsPromt(answers, callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt({
        type: 'input',
        name: 'customFlags',
        message: 'Write custom flags with space separator. Be carefull, there is no any validate!'
    }, function (flagsAnswers) {
        answers.customFlags = flagsAnswers.customFlags.split(' ');
        tarsUtils.tarsSay('Used custom flags: ' + chalk.bold.cyan(answers.customFlags.join(', ')));
        callback(answers);
    });
};
