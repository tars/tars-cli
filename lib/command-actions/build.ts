'use strict';

const chalk = require('chalk');
const runCommand = require('./utils/run-command');
const generalOptionsProcessing = require('./utils/general-options-processing');
const buildPromt = require('../promt/build-promt');
const tarsUtils = require('../utils');
const buildPromtOptions = require('../constants').BUILD;

function extractBuildOptionsFromPromt(answers) {
    let buildOptions = [];

    answers.mode.forEach(mode => {
        switch (mode) {
            case buildPromtOptions.release.title:
                buildOptions.push(buildPromtOptions.release.flag);
                break;
            case buildPromtOptions.min.title:
                buildOptions.push(buildPromtOptions.min.flag);
                break;
            case buildPromtOptions.ie9.title:
                buildOptions.push(buildPromtOptions.ie9.flag);
                break;
            case buildPromtOptions.ie8.title:
                buildOptions.push(buildPromtOptions.ie8.flag);
                break;
            case buildPromtOptions.ie.title:
                buildOptions.push(buildPromtOptions.ie.flag);
                break;
            case buildPromtOptions.customFlags.title:
                buildOptions = buildOptions.concat(answers.customFlags);
                break;
            default:
                break;
        }
    });

    if (buildOptions.indexOf(buildPromtOptions.release.flag) !== -1 &&
        buildOptions.indexOf(buildPromtOptions.min.flag) !== -1) {
        buildOptions.splice(buildPromtOptions.min.flag, 1);
    }

    return buildOptions;
}

function extractBuildOptionsFromFlags(commandOptions) {
    let buildOptions = [];

    tarsUtils.tarsSay('Build options (active are green): ');

    if (commandOptions.release) {
        buildOptions.push(buildPromtOptions.release.flag);
        tarsUtils.tarsSay(chalk.green('✓ Release mode.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('Release mode "-r".'));
    }

    if (commandOptions.min && !commandOptions.release) {
        buildOptions.push(buildPromtOptions.min.flag);
        tarsUtils.tarsSay(chalk.green('✓ Minify mode.'));
    } else {
        tarsUtils.tarsSay(chalk.grey('Minify mode "-m".'));
    }

    return buildOptions.concat(generalOptionsProcessing(commandOptions));
}

/**
 * Get options for build task and start build task in TARS
 * @param  {Object} answers Answers from promt
 * @param  {Object} options from inquirer
 */
function buildInit(answers, commandOptions) {
    const buildOptions = answers ? extractBuildOptionsFromPromt(answers) : extractBuildOptionsFromFlags(commandOptions);

    if (!answers) {
        console.log('\n');
        tarsUtils.tarsSay('Execute ' + chalk.bold.cyan('"tars build --help"') + ', to see all avaliable options.');
        tarsUtils.tarsSay('You can use interactive mode via starting tars without any flags.');
    }

    tarsUtils.tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');
    runCommand('gulp', buildOptions);
}

/**
 * Start build task in gulp
 * @param  {Object} options Build options from commander
 */
module.exports = function build(options) {
    const commandOptions = Object.assign({}, options);

    console.log('\n');
    tarsUtils.spinner.start();
    tarsUtils.tarsSay(chalk.underline('Build task has been started!') + '\n');

    if (tarsUtils.getUsedFlags(commandOptions).length) {
        buildInit(null, commandOptions);
    } else {
        tarsUtils.tarsSay('Welcome to the interactive mode.');
        tarsUtils.tarsSay('Please, answer some questions:');
        buildPromt(buildInit);
    }
};
