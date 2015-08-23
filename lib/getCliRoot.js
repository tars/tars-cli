'use strict';

var exec = require('child_process').exec;

module.exports = function (callback, options) {
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
