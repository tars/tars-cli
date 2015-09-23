'use strict';

var spawn = require('win-spawn');
var tarsUtils = require('../../utils');

/**
 * Run command in diefferent env
 * @param  {String} commandName     Name of the command
 * @param  {Array}  commandOptions  Options for task
 * @param  {Object} options         Additional options
 */
module.exports = function runCommand(commandName, commandOptions, options) {
    var term = {};
    var onCloseActions = function () {};

    if (options && options.onCloseActions) {
        onCloseActions = options.onCloseActions;
    }

    term = spawn(commandName, commandOptions, {stdio: 'inherit'});
    tarsUtils.spinner.stop(true);
};
