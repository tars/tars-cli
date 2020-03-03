import { CommanderStatic } from 'commander';
import {
  AddComponentAction,
  AddPageAction,
  BuildAction,
  DevAction,
  InitAction,
  StartAction,
  UpdateProjectAction,
  UpdateAction,
  VersionAction,
} from '../actions';
import { AddComponentCommand } from './add-component.command';
import { AddPageCommand } from './add-page.command';
import { BuildCommand } from './build.command';
import { DevCommand } from './dev.command';
import { InitCommand } from './init.command';
import { StartCommand } from './start.command';
import { UpdateProjectCommand } from './update-project.command';
import { UpdateCommand } from './update.command';
import { VersionCommand } from './version.command';

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new AddComponentCommand(new AddComponentAction()).load(program);
    new AddPageCommand(new AddPageAction()).load(program);
    new BuildCommand(new BuildAction()).load(program);
    new DevCommand(new DevAction()).load(program);
    new InitCommand(new InitAction()).load(program);
    new StartCommand(new StartAction()).load(program);
    // @ts-ignore
    new UpdateProjectCommand(new UpdateProjectAction()).load(program);
    new UpdateCommand(new UpdateAction()).load(program);
    new VersionCommand(new VersionAction()).load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: CommanderStatic) {
    program.on('command:*', () => {
      process.exit(1);
    });
  }
}
