'use strict';

var inquirer = require('inquirer');
var chalk = require('chalk');
var tarsUtils = require('../utils');

/**
 * Promt for module adding
 * @param  {Function} callback Function to start after promt
 */
module.exports = function addModulePromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt({
        type: 'checkbox',
        name: 'mode',
        message: 'What files/dirs have to be in module?',
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
                name: ' Just empty dir, without files'
            },
            new inquirer.Separator(chalk.grey('—————————————————————————————'))
        ]
    }, function (answers) {
        callback(answers);
    });
};
