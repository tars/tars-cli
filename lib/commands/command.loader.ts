import { CommanderStatic } from 'commander';
import { VersionAction } from '../actions';
import { VersionCommand } from './version.command';

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new VersionCommand(new VersionAction()).load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: CommanderStatic) {
    program.on('command:*', () => {
      process.exit(1);
    });
  }
}
