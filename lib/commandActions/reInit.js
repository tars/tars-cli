'use strict';

var spawn = require('child_process').spawn;
var tarsUtils = require('../utils');
var gulpReInitLog = '';

/**
 * Start re-init task in gulp
 */
module.exports = function reInit() {
    // If we are not in TARS directory or TARS has not been inited
    if (!tarsUtils.getTarsConfig()) {
        return;
    }

    console.log('\n');
    tarsUtils.tarsSay('Reinitialisation task has been started!\n');

    gulpReInitLog = spawn('gulp', ['re-init'], {stdio: 'inherit'});

    if (gulpReInitLog.stdout) {
        gulpReInitLog.stdout.on('data', function (data) {
            process.stdout.write(data.toString());
        });
    }
};
