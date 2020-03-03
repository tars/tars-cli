import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class DevCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('dev')
      .alias('development')
      .description('Build project with watchers')
      .option('-t, --tunnel', 'Create tunnel to the Internet')
      .option('-l, --livereload', 'Start server')
      .option('--lr', 'Allias for livereload')
      .option('--ie9', 'Generate files for ie9')
      .option('--ie8', 'Generate files for ie8')
      .option('--ie', 'Generate files for ie')
      .option('--silent', 'Start dev in silent mode, without promt')
      .option('--custom-flags <customFlags>', 'Add custom flags')
      .action(options => {
        if (this.isTarsReadyToWork()) {
          require('../command-actions/dev')(options);
        }
      });
  }
}
