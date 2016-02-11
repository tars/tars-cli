'use strict';

const chalk = require('chalk');
const inquirer = require('inquirer');
const tarsUtils = require('../utils');

/**
 * Init promt for config
 * @param  {Function} callback Function to start after promt
 */
module.exports = function promt(callback) {
    const args = process.argv.slice(2);
    let promts = [];

    if (args.indexOf('--exclude-css') === -1) {
        promts.push({
            type: 'list',
            name: 'preprocessor',
            message: 'What preprocessor for CSS do you want to use?',
            choices: [
                'Scss',
                'Less',
                'Stylus'
            ]
        });
    }

    if (args.indexOf('--exclude-html') === -1) {
        promts.push({
            type: 'list',
            name: 'templater',
            message: 'What templater for HTML do you want to use?',
            choices: [
                'Handlebars',
                'Jade'
            ]
        });
    }

    promts.push(
        {
            type: 'confirm',
            name: 'useBabel',
            message: 'Would you like to use ES6 (ES.Next) syntax? This feature is supported in TARS 1.4.0 and higher.',
            default: false
        }, {
            type: 'checkbox',
            name: 'useImagesForDisplayWithDpi',
            message: 'What dpi of raster-images are you going to use? Available multiple choice.',
            choices: [
                new inquirer.Separator(chalk.grey('—— Press <space> to select ——')),
                {
                    name: 96,
                    checked: true
                }, {
                    name: 192
                }, {
                    name: 288
                }, {
                    name: 384
                },
                new inquirer.Separator(chalk.grey('—————————————————————————————'))
            ],
            validate: answer => {
                if (answer.length < 1) {
                    return 'You must choose at least one DPI!';
                }
                return true;
            }
        }, {
            type: 'confirm',
            name: 'useNotify',
            message: 'Would you like to use notify in OS?',
            default: true
        }, {
            type: 'input',
            name: 'staticFolderName',
            message: 'Enter static directory name',
            default: () => 'static',
            validate: tarsUtils.validateFolderName
        }, {
            type: 'input',
            name: 'imagesFolderName',
            message: 'Enter images directory name',
            default: () => 'img',
            validate: tarsUtils.validateFolderName
        }
    );

    tarsUtils.tarsSay('Please, answer some questions:\n');
    tarsUtils.spinner.stop(true);

    inquirer.prompt(
        promts,
        answers => {
            tarsUtils.tarsSay(`You can change all options by useing command ${chalk.bold.cyan('"tars re-init"')}.`);
            tarsUtils.tarsSay('Or you can change it manually in tars-config.js\n');
            callback(answers);
        }
    );
};
