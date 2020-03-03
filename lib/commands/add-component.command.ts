import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class AddComponentCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('add-component <componentName>')
      .alias('add-module')
      .description('Add component to markup/components directory')
      .option(
        '-b, --basic',
        'Add component with .js, .scss (.less, .styl) and .html (.jade) files',
      )
      .option(
        '-a, --assets',
        'Add component with general files + folder for assets',
      )
      .option(
        '-d, --data',
        'Add component with general files + folder for data',
      )
      .option('-i, --ie', 'Add component with general files + folder for IE')
      .option(
        '-f, --full',
        'Add component with all files and folders (assets folder, folder for IE and so on)',
      )
      .option(
        '-t, --template',
        'Add component as a copy of _template component',
      )
      .option(
        '-s, --scheme [schemeFile]',
        'Add component, which structure is based on scheme file',
      )
      .option('-e, --empty', 'Add component without files')
      .option('--custom-path <customPath>', 'Add component into custom folder')
      .option('--silent', 'Add component in silent mode, without promt')
      .action((componentName, options) => {
        if (this.isTarsReadyToWork()) {
          require('../command-actions/add-component')(componentName, options);
        }
      });
  }
}
