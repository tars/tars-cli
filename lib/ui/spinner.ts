const Spinner = require('cli-spinner').Spinner;
import { isWindows } from '../utils';

export const spinner = new Spinner('%s');

if (isWindows()) {
    spinner.setSpinnerString('|/-\\');
} else {
    spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
}

/**
 * Helper function for spinner, just stop and start spinner
 */
spinner.restart = function restart() {
    this.stop(true);
    this.start();
};