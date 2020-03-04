import { resolve } from 'path';
const spawn = require('win-spawn'); // TODO: replace with cross-spawn package
import { spinner } from '../ui';

/**
 * Run command in different env
 * @param  {String} commandName     Name of the command
 * @param  {Array}  commandOptions  Options for task
 */
export const runCommand = (commandName: string, commandOptions: string[]) => {

    if (commandName === 'gulp') {
        commandName = resolve(process.env.npmRoot + '.bin/gulp');
    }

    spinner.stop(true);
    spawn(commandName, commandOptions, { stdio: 'inherit' });
};
