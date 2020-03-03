import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class UpdateCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('update')
      .alias('upgrade')
      .description('Update TARS-cli')
      .action(() => this.action.handle());
  }
}
