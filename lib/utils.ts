'use strict';

const chalk = require('chalk');
const os = require('os');
const fsExtra = require('fs-extra');
const Spinner = require('cli-spinner').Spinner;

const spinner = new Spinner('%s');

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
};

module.exports = {

    /**
     * Check that TARS inited in current directory.
     * @return {Object}
     */
    isTarsInited() {
        const cwd = process.cwd();

        try {
            require(`${cwd}/tars-config`);
        } catch (error) {
            if (error.code !== 'MODULE_NOT_FOUND') {
                this.tarsSay(chalk.red('There are some problems with your tars-config.js!\n'), true);
                console.error(error.stack);
                return {
                    inited: true,
                    error: true
                };
            }

            return {
                inited: false,
                error: false
            };
        }

        return {
            inited: true,
            error: false
        };
    },

    /**
     * Gets TARS-config from TARS in current directory.
     * @return {boolean | object} tars-config
     */
    getTarsConfig() {
        const cwd = process.cwd();
        const initedStatus = this.isTarsInited();

        if (initedStatus.inited && !initedStatus.error) {
            return require(`${cwd}/tars-config`);
        }

        if (!initedStatus.error) {
            this.tarsNotInitedActions();
        }
        return false;
    },

    getTarsProjectVersion() {
        const cwd = process.cwd();

        if (this.isTarsInited().inited) {
            return fsExtra.readJsonSync(`${cwd}/tars.json`).version;
        }

        this.tarsNotInitedActions();
        return false;
    },

    /**
     * Output messages from TARS
     * @param  {String}  message Message to output
     * @param  {Boolean} Stopspinner or restart it
     */
    tarsSay(message, stopSpinner) {

        // Restart spinner after every message from TARS
        if (stopSpinner) {
            this.spinner.stop(true);
        } else {
            this.spinner.restart();
        }

        if (os.platform() === 'darwin') {
            console.log(chalk.bold.cyan('🅃 🄰 🅁 🅂 : ') + chalk.bold.white(message));
        } else {
            console.log(chalk.bold.cyan('[ TARS ]: ') + chalk.bold.white(message));
        }
    },

    /**
     * Actions, then TARS is not inited
     * @return {[type]} [description]
     */
    tarsNotInitedActions() {
        console.log('\n');
        this.tarsSay(chalk.red('TARS is not inited.'));
        this.tarsSay(`Use ${chalk.bold.cyan('"tars init"')} to init TARS in current directory.\n`, true);
    },

    /**
     * Validate folder name
     * @param  {String}                     Value Recieved folder name
     * @return {Boolean || String}          True or error text (not consistent, because of inquirer va)
     */
    validateFolderName(value) {
        const pass = /[?<>:*|"\\]/.test(value);

        if (!pass) {
            return true;
        }

        return 'Symbols \'?<>:*|"\\\' are not allowed. Please, enter a valid folder name!';
    },

    /**
     * Extract only used flags from inquirer options
     * @param  {Object} Inquirer options
     * @return {Array}
     */
    getUsedFlags(inquirerOptions) {
        return Object.keys(inquirerOptions).reduce((result, currentValue) => {
            if (currentValue.indexOf('_') !== 0 && currentValue !== 'options' &&
                currentValue !== 'commands' && currentValue !== 'parent') {
                result.push(currentValue);
            }

            return result;
        }, []);
    },

    spinner,

    /**
     * Determines is current platform windows.
     * @return {boolean}
     */
    isWindows
};
