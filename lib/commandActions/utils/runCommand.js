'use strict';

var spawn = require('win-spawn');
var tarsUtils = require('../../utils');
var pty;

if (!tarsUtils.isWindows()) {
    pty = require('pty.js');
}

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

    if (tarsUtils.isWindows()) {
        term = spawn(commandName, commandOptions, {stdio: 'inherit'});
        tarsUtils.spinner.stop(true);
    } else {
        term = pty.spawn(commandName, commandOptions);

        term.on('data', function (data) {
            tarsUtils.spinner.stop(true);
            setTimeout(function () {
                process.stdout.write(data.toString());
            }, 100);
        });

        term.on('close', function () {
            tarsUtils.spinner.stop(true);
            onCloseActions();
        });
    }
};
