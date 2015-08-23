'use strict';

var exec = require('child_process').exec;

module.exports = function (callback, options) {
    exec('npm root -g', function (error, stdout, stderr) {
        if (error) {
            console.log(stderr);
        } else {
            process.env.npmRoot = stdout.toString().replace('\n', '') + '/tars-cli/node_modules/';
            callback(options);
        }
    });
};
