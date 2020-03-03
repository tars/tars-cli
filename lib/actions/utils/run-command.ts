import { resolve } from 'path';
const spawn = require('win-spawn');
import { spinner } from '../../ui';

/**
 * Run command in different env
 * @param  {String} commandName     Name of the command
 * @param  {Array}  commandOptions  Options for task
 */
module.exports = function runCommand(commandName: any, commandOptions: any) {

    if (commandName === 'gulp') {
        commandName = resolve(process.env.npmRoot + '.bin/gulp');
    }

    spinner.stop(true);
    spawn(commandName, commandOptions, { stdio: 'inherit' });
};
