'use strict';

var exec = require('child_process').exec;
var path = require('path');

/**
 * This function get root npm directory for global packages and create env-var with it.
 */
module.exports = function getCliRoot() {
    var cliRootPath = '';
    var args = Array.prototype.slice.call(arguments, 1);
    var callback = arguments[0];

    exec('npm root -g', function (error, stdout, stderr) {
        if (error) {
            console.log(stderr);
        } else {
            cliRootPath = path.join(stdout.toString().replace('\n', ''), '/tars-cli/');
            process.env.cliRoot = cliRootPath;
            process.env.npmRoot = path.join(cliRootPath, 'node_modules/');

            callback.apply({}, args);
        }
    });
};
