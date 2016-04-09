'use strict';

const chalk = require('chalk');
const tarsUtils = require('../utils');
const Download = require('download');

/**
 * Get version of tars-cli
 */
module.exports = function getVersion() {
    const installedTarsCliVersion = require(`${process.env.cliRoot}package.json`).version;

    console.log('\n');
    tarsUtils.tarsSay(`Tars-cli version: "${chalk.cyan.bold(installedTarsCliVersion)}"`, true);

    new Download({ extract: true, mode: '755' })
        .get('https://raw.githubusercontent.com/tars/tars-cli/master/package.json')
        .run((error, files) => {
            if (error) {
                return false;
            }

            const latestTarsCliVersion = JSON.parse(files[0].contents.toString()).version;

            if (installedTarsCliVersion < latestTarsCliVersion) {
                tarsUtils.tarsSay(`Update available! New version is: ${chalk.cyan.bold(latestTarsCliVersion)}`, true);
                tarsUtils.tarsSay(`Run the command ${chalk.cyan.bold('tars update')} to update TARS-cli. \n`, true);
            }
        });

    console.log('\n');
};
