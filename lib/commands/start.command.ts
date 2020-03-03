import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class StartCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('start <taskName>')
      .alias('run')
      .description('Start task from the local gulpfile')
      .option(
        '--flags <flags>',
        'Add flags "--flags" \'flags, with space separator\'',
      )
      .action((taskName, options) => {
        if (this.isTarsReadyToWork()) {
          this.action.handle(taskName, options);
        }
      });
  }
}
