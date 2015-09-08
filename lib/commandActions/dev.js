'use strict';

var spawn = require('win-spawn');
var chalk = require('chalk');
var tarsUtils = require('../utils');
var pty;

if (!tarsUtils.isWindows()) {
    pty = require('pty.js');
}

var buildOptions = ['dev'];
var term = {};

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
 * Start dev task in gulp
 * @param  {Object} options Build options from commander
 */
module.exports = function dev(options) {

    // If we are not in TARS directory or TARS has not been inited
    if (!tarsUtils.isTarsInited()) {
        tarsUtils.tarsNotInitedActions();
        return;
    }

    tarsUtils.spinner.start();

    console.log('\n');
    tarsUtils.tarsSay(chalk.underline('Development task has been started!') + '\n');
    tarsUtils.tarsSay('Build options (active are green): ');

    if (options.tunnel) {
        buildProcessing('✓ Server for tunnel and livereload will be started.', '--tunnel');
    } else {
        tarsUtils.tarsSay(chalk.grey('Server for tunnel and livereload will be started "-t".'));
    }

    if ((options.lr || options.livereload) && !options.tunnel) {
        buildProcessing('✓ Server for livereload will be started.', '--lr');
    } else {
        tarsUtils.tarsSay(chalk.grey('Server for livereload will be started "-l".'));
    }

    if (options.ie8) {
        buildProcessing('✓ IE8 maintenance.', '--ie8');
    } else {
        tarsUtils.tarsSay(chalk.grey('IE8 maintenance "--ie8".\n'));
    }

    tarsUtils.tarsSay('Execute ' + chalk.bold.cyan('"tars dev --help"') + ', to see all avaliable options.');
    tarsUtils.tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');

    if (tarsUtils.isWindows()) {
        term = spawn('gulp', buildOptions, {stdio: 'inherit'});
        tarsUtils.spinner.stop(true);
    } else {
        term = pty.spawn('gulp', buildOptions);

        term.on('data', function(data) {
            tarsUtils.spinner.stop(true);
            setTimeout(function () {
                process.stdout.write(data.toString());
            }, 100);
        });

        term.on('close', function(data) {
            tarsUtils.spinner.stop(true);
        });
    }
};
