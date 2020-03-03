import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class AddPageCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('add-page <pageName>')
      .description('Add page to markup/pages directory')
      .option('-e, --empty', 'Add empty file')
      .action((pageName, options) => {
        if (this.isTarsReadyToWork()) {
          require('../command-actions/add-page')(pageName, options);
        }
      });
  }
}
