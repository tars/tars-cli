'use strict';

var chalk = require('chalk');
var os = require('os');
var Spinner = require('cli-spinner').Spinner;

var spinner = new Spinner('%s');

/**
 * Check operation system name
 * @return {Boolean} Is OS Windows or not
 */
function isWindows() {
    return (/^win/i).test(os.platform());
}

if (isWindows()) {
    spinner.setSpinnerString('|/-\\');
} else {
    spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
}

/**
 * Helper function for spinner, just stop and start spinner
 */
spinner.restart = function restart() {
    this.stop(true);
    this.start();
}

module.exports = {

    /**
     * Check that TARS inited in current directory.
     * @return {boolean} is TARS inited
     */
    isTarsInited: function isTarsInited() {
        var cwd = process.cwd();

        try {
            require(cwd + '/tars-config.js');
        } catch (er) {
            return false;
        }

        return true;
    },

    /**
     * Gets TARS-config from TARS in current directory.
     * @return {boolean | object} tars-config
     */
    getTarsConfig: function getTarsConfig() {
        var cwd = process.cwd();
        var tarsConfig = {};

        if (this.isTarsInited()) {
            tarsConfig = require(cwd + '/tars-config.js');
        } else {
            this.tarsNotInitedActions();
            return false;
        }

        return tarsConfig;
    },

    /**
     * Output messages from TARS
     * @param  {String}  message Message to output
     * @param  {Boolean} Stopspinner or restart it
     */
    tarsSay: function tarsSay(message, stopSpinner) {

        // Restart spinner after every message from TARS
        if (stopSpinner) {
            this.spinner.stop(true);
        } else {
            this.spinner.restart();
        }

        setTimeout(function () {
            if (os.platform() === 'darwin') {
                console.log(chalk.bold.cyan('🅃 🄰 🅁 🅂 : ') + chalk.bold.white(message));
            } else {
                console.log(chalk.bold.cyan('[ TARS ]: ') + chalk.bold.white(message));
            }
        }, 100);
    },

    /**
     * Actions, then TARS is not inited
     * @return {[type]} [description]
     */
    tarsNotInitedActions: function tarsNotInitedActions() {
        console.log('\n');
        this.tarsSay(chalk.red('TARS is not inited.'));
        this.tarsSay('Use ' + chalk.bold.cyan('"tars init"') +' to init TARS in current directory.\n');
    },

    spinner: spinner,

    /**
     * Determines is current platform windows.
     * @return {boolean}
     */
    isWindows: isWindows
}
