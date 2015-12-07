'use strict';

var chalk = require('chalk');
var tarsUtils = require('../utils');
var runCommand = require('./utils/run-command');
var reInitPromt = require('../promt/re-init-promt');
var configPromt = require('../promt/config-promt');
var saveAnswers = require('../promt/save-answers');

function startReInit(answers) {

    if (answers) {
        saveAnswers(answers);
        tarsUtils.tarsSay('Config-file has been updated');
    }

    runCommand('gulp', ['re-init', '--silent']);
}

function startConfigPromt() {
    configPromt(startReInit);
}

/**
 * Start re-init task in gulp
 * @param  {Object} options Options of init
 */
module.exports = function reInit(options) {
    console.log('\n');
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline('Reinitialization task has been started!') + '\n');

    if (options.silent) {
        startReInit();
    } else {
        reInitPromt(startConfigPromt);
    }
};
