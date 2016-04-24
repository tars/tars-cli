'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const tarsUtils = require('../utils');

/**
 * Promt for component adding
 * @param  {Function} callback Function to start after promt
 */
module.exports = function addComponentPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'mode',
            message: 'What files/dirs have to be in component? Available multiple choice.',
            choices: [
                new inquirer.Separator(chalk.grey('—— Press <space> to select ——')),
                {
                    name: ' Basic files (js, html and stylies)',
                    checked: true
                }, {
                    name: ' Assets dir'
                }, {
                    name: ' Data dir'
                }, {
                    name: ' IE dir'
                }, {
                    name: ' Full pack (all available folders and files)'
                }, {
                    name: ' Make a copy of _template'
                }, {
                    name: ' Just empty dir, without files'
                },
                new inquirer.Separator(chalk.grey('—————————————————————————————'))
            ]
        }
    ]).then(answers => callback(answers));
};
