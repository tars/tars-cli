import { AbstractAction } from './abstract.action';
import chalk from 'chalk';
const runCommand = require('./utils/run-command');
import { spinner } from '../ui';
import { tarsSay } from '../utils';

/**
 * Start build task in gulp
 * @param  {String} taskName Task name to start
 * @param  {Object} options  Build options from commander
 */
export class StartAction extends AbstractAction {
  public async handle(taskName: any, options: any) {
    let commandOptions = [taskName];

    console.log('\n');
    spinner.start();
    tarsSay(chalk.underline(`"${taskName}" task has been started!`) + '\n');

    if (options.flags) {
        commandOptions = commandOptions.concat(options.flags.split(' '));
        tarsSay(`Used flags: ${chalk.bold.cyan(options.flags)}`);
    }

    tarsSay('Please wait for a moment, while I\'m preparing builder for working...\n');

    runCommand('gulp', commandOptions);
  }
}
