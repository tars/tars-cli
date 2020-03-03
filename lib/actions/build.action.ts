import { AbstractAction } from './abstract.action';
const chalk = require('chalk');
const runCommand = require('./utils/run-command');
const generalOptionsProcessing = require('./utils/general-options-processing');
const buildPromt = require('../promt/build-promt');
import { spinner } from '../ui';
import { tarsSay, getUsedFlags } from '../utils';
import { BUILD as buildPromtOptions } from '../constants';

/**
 * Start build task in gulp
 * @param  {Object} options Build options from commander
 */
export class BuildAction extends AbstractAction {
  public async handle(options: any) {
    const commandOptions = Object.assign({}, options);

    console.log('\n');
    spinner.start();
    tarsSay(chalk.underline('Build task has been started!') + '\n');

    if (getUsedFlags(commandOptions).length) {
      this.buildInit(null, commandOptions);
    } else {
      tarsSay('Welcome to the interactive mode.');
      tarsSay('Please, answer some questions:');
      buildPromt(this.buildInit);
    }
  }

  /**
   * Get options for build task and start build task in TARS
   * @param  {Object} answers Answers from promt
   * @param  {Object} options from inquirer
   */
  private buildInit(answers: any, commandOptions: any) {
    const buildOptions = answers
      ? this.extractBuildOptionsFromPromt(answers)
      : this.extractBuildOptionsFromFlags(commandOptions);

    if (!answers) {
      console.log('\n');
      tarsSay(
        'Execute ' +
          chalk.bold.cyan('"tars build --help"') +
          ', to see all avaliable options.',
      );
      tarsSay(
        'You can use interactive mode via starting tars without any flags.',
      );
    }

    tarsSay(
      "Please wait for a moment, while I'm preparing builder for working...\n",
    );
    runCommand('gulp', buildOptions);
  }

  private extractBuildOptionsFromFlags(commandOptions: any) {
    let buildOptions = [];

    tarsSay('Build options (active are green): ');

    if (commandOptions.release) {
      buildOptions.push(buildPromtOptions.release.flag);
      tarsSay(chalk.green('✓ Release mode.'));
    } else {
      tarsSay(chalk.grey('Release mode "-r".'));
    }

    if (commandOptions.min && !commandOptions.release) {
      buildOptions.push(buildPromtOptions.min.flag);
      tarsSay(chalk.green('✓ Minify mode.'));
    } else {
      tarsSay(chalk.grey('Minify mode "-m".'));
    }

    return buildOptions.concat(generalOptionsProcessing(commandOptions));
  }

  private extractBuildOptionsFromPromt(answers: any) {
    // @ts-ignore
    let buildOptions = [];

    answers.mode.forEach((mode: any) => {
      switch (mode) {
        case buildPromtOptions.release.title:
          buildOptions.push(buildPromtOptions.release.flag);
          break;
        case buildPromtOptions.min.title:
          buildOptions.push(buildPromtOptions.min.flag);
          break;
        case buildPromtOptions.ie9.title:
          buildOptions.push(buildPromtOptions.ie9.flag);
          break;
        case buildPromtOptions.ie8.title:
          buildOptions.push(buildPromtOptions.ie8.flag);
          break;
        case buildPromtOptions.ie.title:
          buildOptions.push(buildPromtOptions.ie.flag);
          break;
        case buildPromtOptions.customFlags.title:
          // @ts-ignore
          buildOptions = buildOptions.concat(answers.customFlags);
          break;
        default:
          break;
      }
    });

    // @ts-ignore
    if (
      // @ts-ignore
      buildOptions.indexOf(buildPromtOptions.release.flag) !== -1 &&
      // @ts-ignore
      buildOptions.indexOf(buildPromtOptions.min.flag) !== -1
    ) {
      // @ts-ignore
      buildOptions.splice(buildPromtOptions.min.flag, 1);
    }

    // @ts-ignore
    return buildOptions;
  }
}
