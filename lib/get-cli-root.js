'use strict';

var exec = require('child_process').exec;

/**
 * This function get root npm directory for global packages and create env-var with it.
 */
module.exports = function getCliRoot(callback, options) {
    var cliRootPath = '';

    exec('npm root -g', function (error, stdout, stderr) {
        if (error) {
            console.log(stderr);
        } else {
            cliRootPath = stdout.toString().replace('\n', '') + '/tars-cli/';
            process.env.cliRoot = cliRootPath;
            process.env.npmRoot = cliRootPath + 'node_modules/';

            callback(options);
        }
    });
};
