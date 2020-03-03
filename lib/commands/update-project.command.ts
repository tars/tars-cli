import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class UpdateProjectCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('update-project')
      .alias('upgrade-project')
      .description('Update TARS in current project')
      .option('-f, --force', 'Force update, even you have the latest version')
      .option('--exclude-html', 'Prevent templater-files updating')
      .option('--exclude-css', 'Prevent preprocessor-files updating')
      .option('-s, --source <source>', 'Change source of TARS for updating')
      .action(options => {
        if (this.isTarsReadyToWork()) {
          // this.action.handle(options);
          require('../command-actions/update-project')(options);
        }
      });
  }
}
