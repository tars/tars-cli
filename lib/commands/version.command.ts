import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class VersionCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program.option('-v, --version', 'Version of TARS-cli');

    const args = process.argv.slice(2);
    if (
      program.version &&
      args.length &&
      (args[0] === '--version' || args[0] === '-v')
    ) {
      this.action.handle();
    }
  }
}
