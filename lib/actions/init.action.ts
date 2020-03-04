import { AbstractAction } from './abstract.action';
const Download = require('download');
const exec = require('child_process').exec;
const extfs = require('extfs');
const del = require('del');
const fs = require('fs');
const chalk = require('chalk');
import { runCommand } from '../utils';
import { spinner } from '../ui';
import { tarsSay, getTarsProjectVersion, isTarsInited } from '../utils';
const configPromt = require('../promt/config-promt');
const fsPromt = require('../promt/fs-promt');
const saveConfigAnswers = require('../promt/save-config-answers');
let tarsZipUrl = 'https://github.com/tars/tars/archive/master.zip';
let commandOptions = {};

export class InitAction extends AbstractAction {
  /**
   * Init TARS
   * @param  {Object} options Options of init
   */
  public async handle(options: any) {
    const cwd = process.cwd();

    commandOptions = options;
    spinner.start();

    if (options.source) {
      tarsZipUrl = options.source;
    }

    if (isTarsInited().inited) {
      tarsSay('TARS has been inited already!');
      tarsSay("You can't init Tars in current directory again.", true);
      return;
    }

    console.log('\n');
    // @ts-ignore
    extfs.isEmpty(cwd, empty => {
      if (!empty) {
        tarsSay(chalk.red(`Directory "${cwd}" is not empty.`), true);
        fsPromt(this.startInit);
      } else {
        this.startInit();
      }
    });
  }

  /**
   * Main init funciton, download all additional tasks.
   * @param  {Object} answers         Object with answers from promt
   */
  private mainInit(answers: any) {
    const cwd = process.cwd();
    const downloadTars = new Download({
      mode: '755',
      extract: true,
      strip: 1,
    })
      .get(tarsZipUrl)
      .dest(cwd);

    tarsSay('Please, wait for a moment, while magic is happening...');

    downloadTars.run((downloadErr: any) => {
      let commandToExec = 'npm i && npm i gulp@4.0.2 --save-dev';

      if (downloadErr) {
        spinner.stop(true);
        throw downloadErr;
      }

      if (answers) {
        saveConfigAnswers(answers);
      }

      const userPackages = require(`${cwd}/user-package.json`);

      // Get version of TARS from tars.json
      // or package.json if tars.json does not exist
      try {
        process.env.tarsVersion = getTarsProjectVersion();
      } catch (error) {
        process.env.tarsVersion = require(`${cwd}/package.json`).version;
      }

      tarsSay(`TARS version is: ${process.env.tarsVersion}`);

      del.sync([
        `${cwd}/package.json`,
        `${cwd}/user-package.json`,
        `${cwd}/_package.json`,
      ]);

      let packageJson = {};

      packageJson = Object.assign(
        require(`${process.env.cliRoot}/templates/package.json`),
        userPackages,
      );

      fs.writeFileSync(
        'package.json',
        JSON.stringify(packageJson, null, 2) + '\n',
      );
      tarsSay('Local package.json has been created');

      const tarsConfig = require(`${cwd}/tars-config.js`);

      if ((answers && answers.useBabel) || tarsConfig.useBabel) {
        commandToExec +=
          ' && npm i --save @babel/preset-env@"<8.0.0"  @babel/core@"<8.0.0"';
      }

      exec(commandToExec, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log(stderr);
          return;
        }

        let gulpInitCommandOptions = ['init', '--silent'];

        // @ts-ignore
        if (commandOptions.excludeCss) {
          gulpInitCommandOptions.push('--exclude-css');
        }

        // @ts-ignore
        if (commandOptions.excludeHtml) {
          gulpInitCommandOptions.push('--exclude-html');
        }

        tarsSay('Local gulp and other dependencies has been installed');
        runCommand('gulp', gulpInitCommandOptions);
      });
    });
  }

  /**
   * Start initialization
   */
  private startInit() {
    const cwd = process.cwd();

    tarsSay(chalk.underline('Initialization has been started!') + '\n');
    tarsSay("I'll be inited in " + chalk.cyan('"' + cwd + '"'));
    tarsSay(
      'TARS source will be downloaded from ' +
        chalk.cyan('"' + tarsZipUrl + '"'),
    );

    // @ts-ignore
    if (!commandOptions.source) {
      tarsSay(
        'You can specify source url by using flag ' +
          chalk.cyan('"--source"') +
          ' or ' +
          chalk.cyan('"-s"'),
      );
      tarsSay(
        'Example: ' + chalk.cyan('"tars init -s http://url.to.zip.with.tars"'),
      );
      tarsSay(
        'Run command ' + chalk.cyan('"tars init --help"') + ' for more info.\n',
      );
    }

    tarsSay(
      'I\'m going to install "gulp" localy and create local package.json',
    );
    tarsSay(
      'You can modify package.json by using command ' +
        chalk.cyan('"npm init"') +
        ' or manually.',
    );

    // @ts-ignore
    if (commandOptions.silent) {
      // @ts-ignore
      this.mainInit();
    } else {
      configPromt(this.mainInit);
    }
  }
}
