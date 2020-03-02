'use strict';

const fs = require('fs');
const fsExtra = require('fs-extra');
const inquirer = require('inquirer');
const tarsUtils = require('../utils');
const generateChoices = require('./utils/generateChoices');
const fsPromtOptions = require('../constants').FS;

/**
 * Init promt for config
 * @param  {Function} callback Function to start after promt
 */
module.exports = function fsPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: generateChoices.generateForSimpleList(fsPromtOptions)
        }
    ]).then(fsPromtAnswers => {
        switch (fsPromtAnswers.action) {
            case fsPromtOptions.clearDir.title:
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'clearDir',
                    message: `Are you sure, you want to clear dir: ${process.cwd()}`,
                    default: false
                }]).then(answers => {
                    if (answers.clearDir) {
                        fsExtra.removeSync('./*');
                        fsExtra.removeSync('./.*');
                        callback();
                        return;
                    }

                    process.stdout.write('^C\n');
                    return;
                });
                return;

            case fsPromtOptions.createDir.title:
                inquirer.prompt([{
                    type: 'input',
                    name: 'folderName',
                    message: 'Enter directory name',
                    default: () => 'awesome-project',
                    validate: tarsUtils.validateFolderName
                }]).then(answers => {
                    fs.mkdir(answers.folderName);
                    process.chdir(`./${answers.folderName}`);
                    callback();
                });
                break;

            case fsPromtOptions.stopInit.title:
            default:
                process.stdout.write('^C\n');
                return;
        }
    });
};
