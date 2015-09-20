'use strict';

var chalk = require('chalk');
var inquirer = require('inquirer');
var tarsUtils = require('../utils');

/**
 * Init promt for config
 * @param  {Function} callback Function to start after promt
 */
module.exports = function promt(callback) {
    tarsUtils.tarsSay('Please, answer some questions:\n');
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'list',
            name: 'preprocessor',
            message: 'What preprocessor for CSS do you want to use?',
            choices: [
                'scss',
                'less',
                'stylus'
            ]
        }, {
            type: 'list',
            name: 'templater',
            message: 'What templater for HTML do you want to use?',
            choices: [
                'handlebars',
                'jade'
            ]
        }, {
            type: 'checkbox',
            name: 'useImagesForDisplayWithDpi',
            message: 'What dpi of raster-images are you going to use?',
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
            validate: function (answer) {
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
            default: function () {
                return 'static';
            },
            validate: tarsUtils.validateFolderName
        }, {
            type: 'input',
            name: 'imagesFolderName',
            message: 'Enter static directory name',
            default: function () {
                return 'img';
            },
            validate: tarsUtils.validateFolderName
        }
    ], function (answers) {
        console.log('\n');
        callback(answers);
    });
};
