'use strict';

var fs = require('fs');
var fsExtra = require('fs-extra');
var inquirer = require('inquirer');
var tarsUtils = require('../utils');

/**
 * Validate folder name
 * @param  {String}             value Recieved folder name
 * @return {Boolean|String}        true or error text
 */
function validateFolderName(value) {
    var pass = /[?<>:*|"\\]/.test(value);

    if (!pass) {
        return true;
    } else {
        return 'Symbols \'?<>:*|"\\\'are not allowed. Please, enter a valid folder name!';
    }
}

/**
 * Init promt for config
 * @param  {Function} callback Function to start after promt
 */
module.exports = function fsPromt(callback) {
    tarsUtils.spinner.stop(true);

    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'Clear current directory',
            'Create new directory for project',
            'Stop init'
        ]
    }, function (fsPromtAnswers) {

        switch (fsPromtAnswers.action) {
            case 'Clear current directory': {
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'clearDir',
                    message: 'Are you sure, you want to clear dir: ' + process.cwd(),
                    default: false
                }], function (answers) {

                    if (answers.clearDir) {
                        fsExtra.removeSync('./*');
                        fsExtra.removeSync('./.*');
                        callback();
                        return;
                    } else {
                        process.stdout.write('^C\n');
                        return;
                    }
                });
                return;
            }

            case 'Create new directory for project': {
                inquirer.prompt([{
                    type: 'input',
                    name: 'folderName',
                    message: 'Enter directory name',
                    default: function () {
                        return 'awesome-project';
                    },
                    validate: validateFolderName
                }], function (answers) {
                    fs.mkdir(answers.folderName);
                    process.chdir('./' + answers.folderName);
                    callback();
                });
                break;
            }

            case 'Stop init': {
                process.stdout.write('^C\n');
                return;
            }

            default: {
                process.stdout.write('^C\n');
                return;
            }
        }
    });
};
