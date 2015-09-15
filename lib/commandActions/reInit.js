'use strict';

var chalk = require('chalk');
var tarsUtils = require('../utils');
var promt = require('../promt/config-promt');
var saveAnswers = require('../promt/saveAnswers');
var spawn = require('win-spawn');

function reInitCli(answers) {
    var term = {};
    var pty;

    if (!tarsUtils.isWindows()) {
        pty = require('pty.js');
    }

    if (answers) {
        saveAnswers(answers);
        tarsUtils.tarsSay('Config-file has been updated.');
        tarsUtils.tarsSay('All options are available in tars-config.js in the root dir of your project');
    }

    if (tarsUtils.isWindows()) {
        term = spawn('gulp', ['re-init', '--silent'], {stdio: 'inherit'});
        tarsUtils.spinner.stop(true);
    } else {
        term = pty.spawn('gulp', ['re-init', '--silent']);

        term.on('data', function (data) {
            tarsUtils.spinner.restart(true);
            process.stdout.write(data.toString());
        });

        term.on('close', function () {
            tarsUtils.spinner.stop(true);
        });
    }
}

/**
 * Start re-init task in gulp
 * @param {Object} options Options for re-init from cli
 */
module.exports = function reInit(options) {

    // If we are not in TARS directory or TARS has not been inited
    if (!tarsUtils.isTarsInited()) {
        tarsUtils.tarsNotInitedActions();
        return;
    }

    tarsUtils.spinner.start();

    console.log('\n');
    tarsUtils.tarsSay(chalk.underline('Reinitialization task has been started!') + '\n');

    if (options.silent) {
        reInitCli();
    } else {
        promt(reInitCli);
    }
};
