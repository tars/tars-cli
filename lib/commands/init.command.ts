import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class InitCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('init')
      .description('Init TARS-project in current directory')
      .option('--exclude-html', 'Prevent templater-files uploading')
      .option('--exclude-css', 'Prevent preprocessor-files uploading')
      .option('--silent', 'TARS will not ask any question about configuration')
      .option('-s, --source <source>', 'Change source of TARS')
      .action(options => require('../command-actions/init')(options));
  }
}
