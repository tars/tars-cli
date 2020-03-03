import { CommanderStatic } from 'commander';
import { UpdateAction, UpdateProjectAction, StartAction, VersionAction } from '../actions';
import { UpdateCommand } from './update.command';
import { UpdateProjectCommand } from './update-project.command';
import { StartCommand } from './start.command';
import { VersionCommand } from './version.command';

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new UpdateCommand(new UpdateAction()).load(program);
    new UpdateProjectCommand(new UpdateProjectAction()).load(program);
    new StartCommand(new StartAction()).load(program);
    new VersionCommand(new VersionAction()).load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: CommanderStatic) {
    program.on('command:*', () => {
      process.exit(1);
    });
  }
}
