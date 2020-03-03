import { tarsSay } from './';
const chalk = require('chalk');

/**
 * Actions, then TARS is not inited
 * @return {[type]} [description]
 */
export const tarsNotInitedActions = () => {
    console.log("\n");
    // @ts-ignore
    tarsSay(chalk.red("TARS is not inited."));
    tarsSay(
        `Use ${chalk.bold.cyan(
            '"tars init"'
        )} to init TARS in current directory.\n`,
        true
    );
};
