import { AbstractAction } from './abstract.action';
import chalk from 'chalk';
const execSync = require('child_process').execSync;
import { spinner } from '../ui'
import { tarsSay, runCommand } from '../utils'

/**
 * Just updates tars-cli dependencies and tars-cli itself
 */
export class UpdateAction extends AbstractAction {
  public async handle() {
    spinner.start();
    tarsSay(chalk.underline('TARS-CLI update has been started!'));
    tarsSay('Make a cup of tea/coffee, while it is working :)');
    execSync('npm cache clean --force');
    runCommand('npm', ['update', '-g', 'tars-cli']);
  }
}
