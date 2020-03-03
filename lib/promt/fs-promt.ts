'use strict';

const fs = require('fs');
const fsExtra = require('fs-extra');
const inquirer = require('inquirer');
import { spinner } from '../ui';
import { validateFolderName } from '../utils';
const generateChoices = require('./utils/generateChoices');
import { FS as fsPromtOptions } from '../constants';

/**
 * Init promt for config
 * @param  {Function} callback Function to start after promt
 */
module.exports = function fsPromt(callback: any) {
    spinner.stop(true);

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: generateChoices.generateForSimpleList(fsPromtOptions)
        }
    ]).then((fsPromtAnswers: any) => {
        switch (fsPromtAnswers.action) {
            case fsPromtOptions.clearDir.title:
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'clearDir',
                    message: `Are you sure, you want to clear dir: ${process.cwd()}`,
                    default: false
                }]).then((answers: any) => {
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
                    validate: validateFolderName
                }]).then((answers: any) => {
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
