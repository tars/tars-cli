'use strict';

var Download = require('download');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var extfs = require('extfs');
var fs = require('fs');
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

module.exports = function init(options) {
    var tarsZipUrl = 'https://github.com/tars/tars/archive/master.zip';
    var downloadTars = {};
    var downloadOpts = {
        mode: '755',
        extract: true,
        strip: 1
    };

    if (options.source) {
        tarsZipUrl = options.source;
    }

    console.log('\n');
    extfs.isEmpty(cwd, function (empty) {
        if (!empty) {
            tarsUtils.tarsSay(chalk.red('Directory "' + cwd + '" is not empty.'));
            tarsUtils.tarsSay('Try to clear directory and repeat ' + chalk.cyan('"tars init"') + '.\n');
            tarsUtils.tarsSay('Run command ' + chalk.cyan('"tars init --help"') + ' for more info.\n');
            return;
        } else {
            tarsUtils.tarsSay('Initialisation has been started!\n');
            tarsUtils.tarsSay('I\'ll be inited in ' + chalk.cyan('"' + cwd + '"'));
            tarsUtils.tarsSay('TARS source will be downloaded from ' + chalk.cyan('"' + tarsZipUrl + '"'));

            if (!options.source) {
                tarsUtils.tarsSay('You can specify source url by using flag ' + chalk.cyan('"--source"') + ' or ' + chalk.cyan('"-s"'));
                tarsUtils.tarsSay('Example: ' + chalk.cyan('"tars init -s http://url.to.zip.with.tars"'));
                tarsUtils.tarsSay('Run command ' + chalk.cyan('"tars init --help"') + ' for more info.\n');
            } else {
                console.log('\n');
            }

            tarsUtils.tarsSay('I\'m going to install "gulp" localy and create local package.json');
            tarsUtils.tarsSay('You can modify package.json by using command ' + chalk.cyan('"npm init"') + ' or manually.\n');
            tarsUtils.tarsSay('Please, wait for a moment, while magic is happening...\n');

            downloadTars = new Download(downloadOpts).get(tarsZipUrl).dest(cwd);
            downloadTars.run(function (downloadErr) {
                if (downloadErr) {
                    throw downloadErr;
                }

                process.env.tarsVersion = require(cwd + '/package.json').version;
                extfs.remove(['package.json', 'user-package.json', '_package.json'], function () {
                    fs.createReadStream(process.env.cliRoot + 'templates/package.json').pipe(fs.createWriteStream(cwd + '/package.json'));
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
