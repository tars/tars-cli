'use strict';

var chalk = require('chalk');
var os = require('os');

module.exports = {

    /**
     * Gets TARS-config from TARS in current directory.
     * @return {boolean | object} tars-config
     */
    getTarsConfig: function getTarsConfig() {
        var cwd = process.cwd();
        var tarsConfig = {};

        try {
            tarsConfig = require(cwd + '/tars-config.js');
        } catch (er) {
            console.log(chalk.red('\nTARS is not inited.'));
            console.log('Use ' + chalk.bold.cyan('"tars init"') +' to init TARS in current directory.\n');

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
            console.log(chalk.bold.cyan('🅃 🄰 🅁 🅂 : ') + chalk.bold(message));
        } else {
            console.log(chalk.bold.cyan('T A R S: ') + chalk.bold(message));
        }
    },

    /**
     * Determines is current platform windows.
     * @return {boolean}
     */
    isWindows: function isWindows() {
        return (/^win/i).test(os.platform());
    }
}
