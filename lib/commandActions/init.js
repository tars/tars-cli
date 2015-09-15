'use strict';

var Download = require('download');
var exec = require('child_process').exec;
var spawn = require('win-spawn');
var extfs = require('extfs');
var fs = require('fs');
var chalk = require('chalk');
var tarsUtils = require('../utils');
var promt = require('../promt/config-promt');
var saveAnswers = require('../promt/saveAnswers');
var cwd = process.cwd();
var tarsZipUrl = 'https://github.com/tars/tars/archive/master.zip';

/**
 * Init from gulp inside TARS
 */
function initialisation() {
    var term;
    var pty;

    if (!tarsUtils.isWindows()) {
        pty = require('pty.js');
    }

    if (tarsUtils.isWindows()) {
        term = spawn('gulp', ['init', '--silent'], {stdio: 'inherit'});
        tarsUtils.spinner.stop(true);
    } else {
        term = pty.spawn('gulp', ['init', '--silent']);

        term.on('data', function (data) {
            tarsUtils.spinner.restart(true);
            process.stdout.write(data.toString());
        });

        term.on('close', function () {
            tarsUtils.spinner.stop(true);
        });
    }
}

/**
 * Main init funciton, download all additional tasks.
 * @param  {Object} answers         Object with answers from promt
 */
function cliInit(answers) {
    var downloadTars = new Download({
        mode: '755',
        extract: true,
        strip: 1
    }).get(tarsZipUrl).dest(cwd);

    tarsUtils.tarsSay('Please, wait for a moment, while magic is happening...');

    downloadTars.run(function (downloadErr) {

        if (downloadErr) {
            tarsUtils.spinner.stop(true);
            throw downloadErr;
        }

        if (answers) {
            saveAnswers(answers);
            tarsUtils.tarsSay('Config-file has been updated.');
            tarsUtils.tarsSay('All options are available in tars-config.js in the root dir of your project');
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

module.exports = function init(options) {
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

            if (options.silent) {
                cliInit();
            } else {
                promt(cliInit);
            }
        }
    });
};
