import { platform } from 'os';
import chalk from 'chalk';
import { spinner } from '../ui';

/**
 * Output messages from TARS
 * @param  {String}  message Message to output
 * @param  {Boolean} Stopspinner or restart it
 */
export const tarsSay = (message: any, stopSpinner?: any) => {
    // Restart spinner after every message from TARS
    if (stopSpinner) {
        spinner.stop(true);
    } else {
        spinner.restart();
    }

    if (platform() === "darwin") {
        console.log(chalk.bold.cyan("🅃 🄰 🅁 🅂 : ") + chalk.bold.white(message));
    } else {
        console.log(chalk.bold.cyan("[ TARS ]: ") + chalk.bold.white(message));
    }
};
