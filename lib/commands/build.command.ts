import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class BuildCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('build')
      .alias('bld')
      .description('Build project without watchers')
      .option('-r, --release', 'Create release build')
      .option('-m, --min', 'Create build with minified files')
      .option('--ie9', 'Generate files for ie9')
      .option('--ie8', 'Generate files for ie8')
      .option('--ie', 'Generate files for ie')
      .option('--silent', 'Start build in silent mode, without promt')
      .option('--custom-flags <customFlags>', 'Add custom flags')
      .action(options => {
        if (this.isTarsReadyToWork()) {
          require('../command-actions/build')(options);
        }
      });
  }
}
