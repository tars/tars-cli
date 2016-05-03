'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const tarsUtils = require('../utils');
const addComponentdPromtOptions = require('../constants').ADD_COMPONENT;

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
                    name: addComponentdPromtOptions.basic,
                    checked: true
                }, {
                    name: addComponentdPromtOptions.assets
                }, {
                    name: addComponentdPromtOptions.data
                }, {
                    name: addComponentdPromtOptions.ie
                }, {
                    name: addComponentdPromtOptions.full
                }, {
                    name: addComponentdPromtOptions.template
                }, {
                    name: addComponentdPromtOptions.empty
                },
                new inquirer.Separator(chalk.grey('—————————————————————————————'))
            ]
        }
    ]).then(answers => callback(answers));
};
