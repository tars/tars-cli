'use strict';

const exec = require('child_process').exec;
const path = require('path');

/**
 * This function get root npm directory for global packages and create env-var with it.
 */
module.exports = function getCliRoot() {
    const args = Array.prototype.slice.call(arguments, 1);
    const callback = arguments[0];
    var cliRootPath = '';

    exec('npm root -g', (error, stdout, stderr) => {
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
