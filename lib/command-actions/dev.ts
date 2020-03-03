const chalk = require('chalk');
const runCommand = require('./utils/run-command');
const generalOptionsProcessing = require('./utils/general-options-processing');
const devPromt = require('../promt/dev-promt');
import { spinner } from '../ui';
import { tarsSay, getUsedFlags } from '../utils';
import { DEV as devPromtOptions } from '../constants';

function extractBuildOptionsFromPromt(answers: any) {
    // @ts-ignore
    let buildOptions = [];

    answers.mode.forEach((mode: any) => {
        switch (mode) {
            case devPromtOptions.livereload.title:
                buildOptions.push(devPromtOptions.livereload.flag);
                break;
            case devPromtOptions.tunnel.title:
                buildOptions.push(devPromtOptions.tunnel.flag);
                break;
            case devPromtOptions.ie9.title:
                buildOptions.push(devPromtOptions.ie9.flag);
                break;
            case devPromtOptions.ie8.title:
                buildOptions.push(devPromtOptions.ie8.flag);
                break;
            case devPromtOptions.ie.title:
                buildOptions.push(devPromtOptions.ie.flag);
                break;
            case devPromtOptions.customFlags.title:
                // @ts-ignore
                buildOptions = buildOptions.concat(answers.customFlags);
                break;
            default: {
                break;
            }
        }
    });

    // @ts-ignore
    if (buildOptions.indexOf(devPromtOptions.tunnel.flag) > -1 &&
        // @ts-ignore
        buildOptions.indexOf(devPromtOptions.livereload.flag) > -1) {
        // @ts-ignore
        buildOptions.splice(buildOptions.indexOf(devPromtOptions.livereload.flag), 1);
    }

    // @ts-ignore
    return buildOptions;
}

function extractBuildOptionsFromFlags(commandOptions: any) {
    let buildOptions = [];

    tarsSay('Build options (active are green): ');

    if (commandOptions.tunnel) {
        buildOptions.push(devPromtOptions.tunnel.flag);
        tarsSay(chalk.green('✓ Server for tunnel and livereload will be started.'));
    } else {
        tarsSay(chalk.grey('Server for tunnel and livereload will be started "-t".'));
    }

    if ((commandOptions.lr || commandOptions.livereload) && !commandOptions.tunnel) {
        buildOptions.push(devPromtOptions.livereload.flag);
        tarsSay(chalk.green('✓ Server for livereload will be started.'));
    } else {
        tarsSay(chalk.grey('Server for livereload will be started "-l".'));
    }

    return buildOptions.concat(generalOptionsProcessing(commandOptions));
}

/**
 * Get options for dev task and start dev task in TARS
 * @param  {Object} answers Answers from promt
 */
function devInit(answers: any, commandOptions: any) {
    let buildOptions = answers ? extractBuildOptionsFromPromt(answers) : extractBuildOptionsFromFlags(commandOptions);

    buildOptions = ['dev'].concat(buildOptions);

    if (!answers) {
        console.log('\n');
        tarsSay('Execute ' + chalk.bold.cyan('"tars dev --help"') + ', to see all avaliable options.');
        tarsSay('You can use interactive mode via starting tars without any flags.');
    }

    tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');
    runCommand('gulp', buildOptions);
}

/**
 * Start dev task in gulp
 * @param  {Object} options Build options from commander
 */
module.exports = function dev(options: any) {
    const commandOptions = Object.assign({}, options);

    console.log('\n');
    spinner.start();
    tarsSay(chalk.underline('Development task has been started!') + '\n');

    if (getUsedFlags(commandOptions).length) {
        devInit(null, commandOptions);
    } else {
        tarsSay('Welcome to the interactive mode.');
        tarsSay('Please, answer some questions:');
        devPromt(devInit);
    }
};
