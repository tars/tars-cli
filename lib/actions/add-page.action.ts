import { AbstractAction } from './abstract.action';
const fs = require('fs');
import chalk from 'chalk';
import { spinner } from '../ui';
import { tarsSay, getTarsConfig } from '../utils';
const fsExtra = require('fs-extra');
const getTemplaterExtension = require('./utils/get-templater-extension');

export class AddPageAction extends AbstractAction {
  /**
   * Create page in markup directory
   * @param  {String} pageName   The name of new page
   * @param  {Object} opts       Options
   */
  public async handle(pageName: any, opts: any) {
    const cwd = process.cwd();
    const tarsConfig = getTarsConfig();
    const templater = tarsConfig.templater.toLowerCase();
    let extension = getTemplaterExtension(templater);
    // Path to new page. Includes page name
    let npd = `${cwd}/markup/pages/${pageName}`;

    // Check extension in pageName
    if (pageName.indexOf('.') === -1) {
      npd += '.' + extension;
    } else {
      extension = pageName.split('.').pop();
    }

    console.log('\n');

    fs.stat(npd, (fsErr: any, stats: any) => {
      if (!stats) {
        if (opts.empty) {
          fs.closeSync(fs.openSync(npd, 'w'));
          tarsSay(
            chalk.green(
              'Page "' + pageName + '" has been added to markup/pages.\n',
            ),
            true,
          );
        } else {
          // @ts-ignore
          fsExtra.copy(
            cwd + '/markup/pages/_template.' + extension,
            npd,
            // @ts-ignore
            error => {
              if (error) {
                tarsSay(
                  chalk.red(
                    '"_template.' +
                      extension +
                      '" does not exist in the "markup/pages" directory.',
                  ),
                );
                tarsSay('This file is used as template for new page.');
                tarsSay(
                  'Create this file or run the command ' +
                    chalk.cyan('"tars add-page <pageName> -e"') +
                    ' to create empty page.\n',
                  true,
                );
                return;
              }

              tarsSay(
                chalk.green(
                  'Page "' + pageName + '" has been added to markup/pages.\n',
                ),
                true,
              );
            },
          );
        }
      } else {
        tarsSay(chalk.red('Page "' + pageName + '" already exists.\n'), true);
      }
    });

    spinner.stop(true);
  }
}
