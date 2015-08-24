'use strict';

var fs = require('fs');
var chalk = require('chalk');
var tarsUtils = require('../utils');
var fsExtra = require('fs-extra');

/**
 * Create page in markup directory
 * @param  {String} pageName   The name of new page
 * @param  {Object} opts       Options
 */
module.exports = function addPage(pageName, opts) {
    var cwd = process.cwd();
    // Path to new page. Includes page name
    var npd = cwd + '/markup/pages/' + pageName;
    var templater = 'jade';
    var extension = 'jade';
    var tarsConfig = tarsUtils.getTarsConfig();

    // Get config from tars-config in cwd
    templater = tarsConfig.templater.toLowerCase();
    extension = templater;

    if (templater === 'handlebars' ||
        templater === 'handelbars' ||
        templater === 'hdb' ||
        templater === 'hb') {
        extension = 'html';
    }

    // Check extension in pageName
    if (!(pageName.indexOf('.') + 1)) {
        npd += '.' + extension;
    }

    console.log('\n');

    fs.stat(npd, function (fsErr, stats) {

        if (!stats) {

            if (opts.empty) {
                fs.closeSync(fs.openSync(npd, 'w'));
                tarsUtils.tarsSay(chalk.green('Page "' + pageName + '" has been added to markup/pages.\n'));
            } else {

                fsExtra.copy(cwd + '/markup/pages/_template.' + extension, npd, function (error) {

                    if (error) {
                        tarsUtils.tarsSay(chalk.red('"_template.' + extension + '" does not exist in the "markup/pages" directory.'));
                        tarsUtils.tarsSay('This file is used as template for new page.');
                        tarsUtils.tarsSay('Create this file or run the command ' + chalk.cyan('"tars add-page <pageName> -e"') + ' to create empty page.\n');
                        return;
                    }

                    tarsUtils.tarsSay(chalk.green('Page "' + pageName + '" has been added to markup/pages.\n'));
                });
            }
        } else {
            tarsUtils.tarsSay(chalk.red('Page "' + pageName + '" already exists.\n'));
        }
    });
};
