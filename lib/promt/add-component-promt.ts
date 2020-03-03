const inquirer = require('inquirer');
import { spinner } from '../ui';
import { ADD_COMPONENT as addComponentdPromtOptions } from '../constants';
const customPathPromt = require('./custom-path-promt');
const customSchemePromt = require('./custom-scheme-promt');
const generateChoices = require('./utils/generateChoices');

/**
 * Promt for component adding
 * @param  {Function} callback Function to start after promt
 */
module.exports = function addComponentPromt(callback: any) {
    spinner.stop(true);

    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'mode',
            message: 'What files/dirs have to be in component? Available multiple choice.',
            choices: generateChoices.generateForCheckboxList(addComponentdPromtOptions),
            pagination: true,
            pageSize: 12
        }
    ]).then((addComponentAnswers: any) => {
        // @ts-ignore
        if (addComponentAnswers.mode.indexOf(addComponentdPromtOptions.scheme.title) > -1) {
            return customSchemePromt(addComponentAnswers, callback);
        // @ts-ignore
        } else if (addComponentAnswers.mode.indexOf(addComponentdPromtOptions.customPath.title) > -1) {
            return customPathPromt(addComponentAnswers, callback);
        } else {
            return callback(addComponentAnswers);
        }
    });
};
