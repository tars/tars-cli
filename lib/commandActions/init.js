'use strict';

var Download = require('download');
var exec = require('child_process').exec;
var extfs = require('extfs');
var fs = require('fs');
var chalk = require('chalk');
var pty = require('pty.js');
var tarsUtils = require('../utils');
var cwd = process.cwd();

function initialisation() {
    var term = pty.spawn('gulp', ['init', '--silent']);

    term.on('data', function(data) {
        tarsUtils.spinner.restart(true);
        process.stdout.write(data.toString());
    });

    term.on('close', function(data) {
        tarsUtils.spinner.stop(true);
    });
}

module.exports = function init(options) {
    var tarsZipUrl = 'https://github.com/tars/tars/archive/master.zip';
    var downloadTars = {};
    var downloadOpts = {
        mode: '755',
        extract: true,
        strip: 1
    };

    tarsUtils.spinner.start();

    if (options.source) {
        tarsZipUrl = options.source;
    }

    if (tarsUtils.isTarsInited()) {
        tarsUtils.tarsSay('Tars has been inited already!');
        tarsUtils.tarsSay('You can\'t init Tars in current directory again.');
        tarsUtils.tarsSay('If you need to change preprocessor ot templater, change it in tars-config.');
        tarsUtils.tarsSay('Run the command ' + chalk.cyan('"tars re-init"') + ' after setting.');
        tarsUtils.spinner.stop(true);
        return;
    }

    console.log('\n');
    extfs.isEmpty(cwd, function (empty) {
        if (!empty) {
            tarsUtils.tarsSay(chalk.red('Directory "' + cwd + '" is not empty.'));
            tarsUtils.tarsSay('Try to clear directory and repeat ' + chalk.cyan('"tars init"') + '.\n');
            tarsUtils.tarsSay('Run command ' + chalk.cyan('"tars init --help"') + ' for more info.\n');
            tarsUtils.spinner.stop(true);
            return;
        } else {
            tarsUtils.tarsSay(chalk.underline('Initialization has been started!') + '\n');
            tarsUtils.tarsSay('I\'ll be inited in ' + chalk.cyan('"' + cwd + '"'));
            tarsUtils.tarsSay('TARS source will be downloaded from ' + chalk.cyan('"' + tarsZipUrl + '"'));

            if (!options.source) {
                tarsUtils.tarsSay('You can specify source url by using flag ' + chalk.cyan('"--source"') + ' or ' + chalk.cyan('"-s"'));
                tarsUtils.tarsSay('Example: ' + chalk.cyan('"tars init -s http://url.to.zip.with.tars"'));
                tarsUtils.tarsSay('Run command ' + chalk.cyan('"tars init --help"') + ' for more info.\n');
            }

            tarsUtils.tarsSay('I\'m going to install "gulp" localy and create local package.json');
            tarsUtils.tarsSay('You can modify package.json by using command ' + chalk.cyan('"npm init"') + ' or manually.');
            tarsUtils.tarsSay('Please, wait for a moment, while magic is happening...\n');

            downloadTars = new Download(downloadOpts).get(tarsZipUrl).dest(cwd);
            downloadTars.run(function (downloadErr) {

                if (downloadErr) {
                    tarsUtils.spinner.stop(true);
                    throw downloadErr;
                }

                process.env.tarsVersion = require(cwd + '/package.json').version;
                tarsUtils.tarsSay('Tars version is: ' + process.env.tarsVersion);

                extfs.remove(['package.json', 'user-package.json', '_package.json'], function () {
                    fs.createReadStream(process.env.cliRoot + 'templates/package.json').pipe(fs.createWriteStream(cwd + '/package.json'));
                    tarsUtils.tarsSay('Local package.json has been created');

                    exec('npm i gulp --save', function (error, stdout, stderr) {
                        if (error) {
                            console.log(stderr);
                        } else {
                            tarsUtils.tarsSay('Local gulp has been installed');
                            initialisation();
                        }
                    });
                });
            });
        }
    });
};
