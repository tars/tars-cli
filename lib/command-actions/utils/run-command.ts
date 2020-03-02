'use strict';

const path = require('path');
const spawn = require('win-spawn');
const tarsUtils = require('../../utils');

/**
 * Run command in different env
 * @param  {String} commandName     Name of the command
 * @param  {Array}  commandOptions  Options for task
 */
module.exports = function runCommand(commandName, commandOptions) {

    if (commandName === 'gulp') {
        commandName = path.resolve(process.env.npmRoot + '.bin/gulp');
    }

    tarsUtils.spinner.stop(true);
    spawn(commandName, commandOptions, { stdio: 'inherit' });
};
