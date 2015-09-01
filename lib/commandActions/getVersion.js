'use strict';

var chalk = require('chalk');
var tarsUtils = require('../utils');

/**
 * Get version of tars-cli
 */
module.exports = function getVersion() {
    var packageInfo = require(process.env.cliRoot + 'package.json');
    console.log('\n');
    tarsUtils.tarsSay('Tars-cli version: ' + chalk.cyan('"' + packageInfo.version + '"\n'), true);
};
