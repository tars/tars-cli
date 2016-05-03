'use strict';

const path = require('path');
const spawn = require('win-spawn');
const tarsUtils = require('../../utils');

/**
 * Run command in different env
 * @param  {String} commandName     Name of the command
 * @param  {Array}  commandOptions  Options for task
 * @param  {Object} options         Additional options
 */
module.exports = function runCommand(commandName, commandOptions, options) {
    let onCloseActions = function () {};

    if (options && options.onCloseActions) {
        onCloseActions = options.onCloseActions;
    }

    if (commandName === 'gulp') {
        commandName = path.resolve(process.env.npmRoot + '.bin/gulp');
    }

    spawn(commandName, commandOptions, { stdio: 'inherit' });
    tarsUtils.spinner.stop(true);
};
