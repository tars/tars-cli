'use strict';

var chalk = require('chalk');
var os = require('os');

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
     * @param  {String} message Message to output
     */
    tarsSay: function tarsSay(message) {
        if (os.platform() === 'darwin') {
            console.log(chalk.bold.cyan('🅃 🄰 🅁 🅂 : ') + chalk.bold.white(message));
        } else {
            console.log(chalk.bold.cyan('[ TARS ]: ') + chalk.bold.white(message));
        }
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

    /**
     * Determines is current platform windows.
     * @return {boolean}
     */
    isWindows: function isWindows() {
        return (/^win/i).test(os.platform());
    }
}
