'use strict';

const chalk = require('chalk');
const tarsUtils = require('../utils');
const runCommand = require('./utils/run-command');
const reInitPromt = require('../promt/re-init-promt');
const configPromt = require('../promt/config-promt');
const saveAnswers = require('../promt/save-answers');

let commandOptions = {};

function startReInit(answers) {

    if (answers) {
        saveAnswers(answers);
        tarsUtils.tarsSay('Config-file has been updated');
    }

    let gulpReInitCommandOptions = ['re-init', '--silent'];

    if (commandOptions.excludeCss) {
        gulpReInitCommandOptions.push('--exclude-css');
    }

    if (commandOptions.excludeHtml) {
        gulpReInitCommandOptions.push('--exclude-html');
    }

    runCommand('gulp', gulpReInitCommandOptions);
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
    tarsUtils.tarsSay(chalk.underline('Reinitialization task has been started!'));
    tarsUtils.tarsSay(chalk.yellow('This command is depricated and won\'t be supported in the future!') + '\n');

    commandOptions = options;

    if (options.silent) {
        startReInit();
    } else {
        reInitPromt(startConfigPromt);
    }
};
