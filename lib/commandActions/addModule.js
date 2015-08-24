'use strict';

var fs = require('fs');
var chalk = require('chalk');
var tarsUtils = require('../utils');

/**
 * Generate base files for module. Js, Html and Css file
 * @param  {String} path       Path to module. Includes module name
 * @param  {String} moduleName The name of new module
 * @param  {Object} extensions Extensions for tpl and css files
 */
function generateBaseFiles(path, moduleName, extensions) {
    fs.appendFileSync(
        path + '/' + moduleName + '.' + extensions.css, '\n');
    fs.appendFileSync(path + '/' + moduleName + '.js', '\n');
    fs.appendFileSync(path + '/' + moduleName + '.' + extensions.tpl, '\n');
}

/**
 * Create folder for IE's stylies
 * @param  {String} path Path to module. Includes module name
 */
function createIEFolder(path) {
    fs.mkdirSync(path + '/ie');
}

/**
 * Create folder for assets
 * @param  {String} path Path to module. Includes module name
 */
function createAssetsFolder(path) {
    fs.mkdirSync(path + '/assets');
}

/**
 * Create module in markup directory
 * @param  {String} moduleName The name of new module
 * @param  {Object} opts       Options
 */
module.exports = function addModule(moduleName, opts) {
    var cwd = process.cwd();
    // Path to new module. Includes module name
    var nmd = cwd + '/markup/modules/' + moduleName;
    var templater = 'jade';
    var cssPreprocessor = 'scss';
    var extensions = {
        tpl: 'jade',
        css: 'scss'
    };
    var tarsConfig = tarsUtils.getTarsConfig();

    // Get config from tars-config in cwd
    templater = tarsConfig.templater.toLowerCase();
    cssPreprocessor = tarsConfig.cssPreprocessor.toLowerCase();

    if (templater === 'handlebars' ||
        templater === 'handelbars' ||
        templater === 'hdb' ||
        templater === 'hb') {
        extensions.tpl = 'html';
    }

    if (cssPreprocessor === 'stylus') {
        extensions.css = 'styl';
    } else {
        extensions.css = cssPreprocessor;
    }

    console.log('\n');

    // Create new module if module with moduleName is not existed already
    fs.stat(nmd, function (fsErr, stats) {

        if (!stats) {
            fs.mkdir(nmd, function () {

                if (opts.full) {
                    generateBaseFiles(nmd, moduleName, extensions);
                    createIEFolder(nmd);
                    createAssetsFolder(nmd);
                }

                if (opts.assets) {
                    generateBaseFiles(nmd, moduleName, extensions);
                    createAssetsFolder(nmd);
                }

                if (opts.ie) {
                    generateBaseFiles(nmd, moduleName, extensions);
                    createIEFolder(nmd);
                }

                if (opts.basic) {
                    generateBaseFiles(nmd, moduleName, extensions);
                }

                tarsUtils.tarsSay(chalk.green('Module "' + moduleName + '" has been added to markup/modules.\n'));
            });
        } else {
            tarsUtils.tarsSay(chalk.red('Module "' + moduleName + '" already exists.\n'));
        }
    });
};
