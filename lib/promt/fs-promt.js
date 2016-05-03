'use strict';

const fs = require('fs');
const fsExtra = require('fs-extra');
const inquirer = require('inquirer');
const tarsUtils = require('../utils');

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
            choices: [
                'Clear current directory',
                'Create new directory for project',
                'Stop init'
            ]
        }
    ]).then(fsPromtAnswers => {
        switch (fsPromtAnswers.action) {
            case 'Clear current directory':
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

            case 'Create new directory for project':
                inquirer.prompt([{
                    type: 'input',
                    name: 'folderName',
                    message: 'Enter directory name',
                    default: () => 'awesome-project',
                    validate: tarsUtils.validateFolderName
                }]).then(answers => {
                    fs.mkdir(answers.folderName);
                    process.chdir('./' + answers.folderName);
                    callback();
                });
                break;

            case 'Stop init':
                process.stdout.write('^C\n');
                return;

            default:
                process.stdout.write('^C\n');
                return;
        }
    });
};
