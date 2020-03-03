import chalk from 'chalk';
import { tarsSay } from './';
import { IsTarsInitedResult } from '../interfaces';

/**
 * Check that TARS inited in current directory.
 * @return {Object}
 */
export const isTarsInited = (): IsTarsInitedResult => {
  const cwd = process.cwd();

  try {
    require(`${cwd}/tars-config`);
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      tarsSay(
        chalk.red('There are some problems with your tars-config.js!\n'),
        true,
      );
      console.error(error.stack);
      return {
        inited: true,
        error: true,
      };
    }

    return {
      inited: false,
      error: false,
    };
  }

  return {
    inited: true,
    error: false,
  };
};
