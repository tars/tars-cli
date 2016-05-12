'use strict';

const inquirer = require('inquirer');
const tarsUtils = require('../utils');
const addComponentdPromtOptions = require('../constants').ADD_COMPONENT;
const customPathPromt = require('./custom-path-promt');
const generateChoices = require('./utils/generateChoices');

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
            choices: generateChoices.generateForCheckboxList(addComponentdPromtOptions),
            pagination: true,
            pageSize: 12
        }
    ]).then(addComponentAnswers => {
        if (addComponentAnswers.mode.indexOf(addComponentdPromtOptions.customPath.title) > -1) {
            customPathPromt(addComponentAnswers, callback);
        } else {
            callback(addComponentAnswers);
        }
    });
};
