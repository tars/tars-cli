'use strict';

const chalk = require('chalk');
const inquirer = require('inquirer');
const tarsUtils = require('../utils');
const configPromtOptions = require('../constants').CONFIG;

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
                'Jade (supports only 1.11.0)',
                'Pug'
            ]
        });
    }

    promts.push(
        {
            type: 'list',
            name: 'cssWorkflow',
            message: 'What workflow for CSS processing do you want to use?',
            choices: Object.keys(configPromtOptions.css.workflow)
        }, {
            type: 'list',
            name: 'jsWorkflow',
            message: 'What workflow for JavaScript processing do you want to use?',
            choices: Object.keys(configPromtOptions.js.workflow)
        }, {
            type: 'confirm',
            name: 'useLint',
            message: 'Would you like to check your JavaScript with ESLint?',
            default: true
        }, {
            type: 'confirm',
            name: 'useBabel',
            message: 'Would you like to use ES6 (ES.Next) syntax?',
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
                    return 'You have to choose at least one DPI!';
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
            message: 'Enter static folder name',
            default: () => 'static',
            validate: tarsUtils.validateFolderName
        }, {
            type: 'input',
            name: 'imagesFolderName',
            message: 'Enter images folder name',
            default: () => 'img',
            validate: tarsUtils.validateFolderName
        }, {
            type: 'input',
            name: 'componentsFolderName',
            message: 'Enter components folder name',
            default: () => 'components',
            validate: tarsUtils.validateFolderName
        }
    );

    tarsUtils.tarsSay('Please, answer some questions:\n');
    tarsUtils.spinner.stop(true);

    inquirer.prompt(promts).then(answers => {
        tarsUtils.tarsSay('You can change all options in tars-config.js\n');
        callback(answers);
    });
};
