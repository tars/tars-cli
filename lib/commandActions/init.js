'use strict';

var Download = require('download');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var extfs = require('extfs');
var chalk = require('chalk');
var tarsUtils = require('../utils');
var cwd = process.cwd();

function initialisation() {
    var gulpInitPipe = spawn('gulp', ['init'], {stdio: 'inherit'});

    if (gulpInitPipe.stdout) {
        gulpInitPipe.stdout.on('data', function (data) {
            process.stdout.write(data.toString());
        });
    }
}

module.exports = function init() {
    var tarsZipUrl = 'https://github.com/tars/tars/archive/version-1.3.0-cli-integration.zip';
    var downloadTars = {};
    var downloadOpts = {
        mode: '755',
        extract: true,
        strip: 1
    };

    console.log('\n');
    extfs.isEmpty(cwd, function (empty) {
        if (!empty) {
            tarsUtils.tarsSay(chalk.red('Directory "' + cwd + '" is not empty.'));
            tarsUtils.tarsSay('Try to clear directory and repeat ' + chalk.cyan('"tars init"') + '.\n');
            return;
        } else {
            tarsUtils.tarsSay('Initialisation has been started!');
            tarsUtils.tarsSay('I\'ll be inited in ' + cwd);
            tarsUtils.tarsSay('I\'ll install "gulp" localy and create local package.json');
            tarsUtils.tarsSay('You can modify package.json by using command ' + chalk.cyan('"npm init"') + ' or manually.\n');
            tarsUtils.tarsSay('Please, wait for a moment, while magic is happening...\n');

            downloadTars = new Download(downloadOpts).get(tarsZipUrl).dest(cwd);
            downloadTars.run(function (err) {
                if (err) {
                    throw err;
                }

                process.env.tarsVersion = require(cwd + '/package.json').version;
                extfs.remove(['package.json', 'user-package.json', '_package.json'], function () {
                    exec('npm i gulp --save', function (error, stdout, stderr) {
                        if (error) {
                            console.log(stderr);
                        } else {
                            initialisation();
                        }
                    });
                });
            });
        }
    });
};
