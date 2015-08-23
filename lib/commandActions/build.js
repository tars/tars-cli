'use strict';

var spawn = require('child_process').spawn;
var chalk = require('chalk');
var tarsUtils = require('../utils');

var buildOptions = [];
var gulpLog = {};

/**
 * Output message about build options and proxy options to gulp task
 * @param  {String} message Message to output
 * @param  {String} mode    Options for gulp task
 */
function buildProcessing(message, mode) {
    buildOptions.push(mode);
    tarsUtils.tarsSay(chalk.green(message));
}

/**
 * Start build task in gulp
 * @param  {Object} options Build options from commander
 */
module.exports = function build(options) {

    // If we are not in TARS directory or TARS has not been inited
    if (!tarsUtils.getTarsConfig()) {
        return;
    }

    console.log('\n');
    tarsUtils.tarsSay('Build task has been started!\n');

    tarsUtils.tarsSay('Build options (active are green): ');
    if (options.release) {
        buildProcessing('✓ Release mode.', '--release');
    } else {
        tarsUtils.tarsSay(chalk.grey('Release mode "-r".'));
    }

    if (options.min && !options.release) {
        buildProcessing('✓ Minify mode.', '--min');
    } else {
        tarsUtils.tarsSay(chalk.grey('Minify mode "-m".'));
    }

    if (options.ie8) {
        buildProcessing('✓ IE8 maintenance.', '--ie8');
    } else {
        tarsUtils.tarsSay(chalk.grey('IE8 maintenance "--ie8".'));
    }

    console.log('\n');
    tarsUtils.tarsSay('Execute ' + chalk.bold.cyan('"tars build --help"') + ', to see all avaliable options.');
    tarsUtils.tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');

    gulpLog = spawn('gulp', buildOptions, {stdio: 'inherit'});

    if (gulpLog.stdout) {
        gulpLog.stdout.on('data', function (data) {
            process.stdout.write(data.toString());
        });
    }
};
