'use strict';

var fs = require('fs');
var chalk = require('chalk');
var addModulePromt = require('../promt/add-module-promt');
var tarsUtils = require('../utils');
var cwd = process.cwd();
// Path to new module. Includes module name
var nmd;
var templater = 'jade';
var cssPreprocessor = 'scss';
var extensions = {
    tpl: 'jade',
    css: 'scss'
};
var tarsConfig = tarsUtils.getTarsConfig();
var commandOptions;
var newModuleName;

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

/**
 * Generate base files for module. Js, Html and Css file
 */
function generateBaseFiles() {
    fs.appendFileSync(
        nmd + '/' + newModuleName + '.' + extensions.css, '\n');
    fs.appendFileSync(nmd + '/' + newModuleName + '.js', '\n');
    fs.appendFileSync(nmd + '/' + newModuleName + '.' + extensions.tpl, '\n');

    if (extensions.tpl === 'jade') {
        fs.writeFileSync(
            nmd + '/' + newModuleName + '.' + extensions.tpl,
            'mixin ' + newModuleName + '(data)'
        );
    }
}

/**
 * Create folder for IE's stylies
 */
function createIEFolder() {
    fs.mkdirSync(nmd + '/ie');
}

/**
 * Create folder for assets
 */
function createAssetsFolder() {
    fs.mkdirSync(nmd + '/assets');
}

/**
 * Create folder for data
 */
function createDataFolder() {
    var processedModuleName = newModuleName;

    if (processedModuleName.indexOf('-') > -1) {
        processedModuleName = '\'' + processedModuleName + '\'';
    }

    fs.mkdirSync(nmd + '/data');
    fs.appendFileSync(nmd + '/data/data.js', '\n');

    fs.writeFileSync(
        nmd + '/data/data.js',
        processedModuleName + ': {}'
    );
}

/**
 * Create module with structure based on command options
 */
function createModule() {
    fs.mkdir(nmd, function () {
        var generateStructure = true;

        if (commandOptions.empty) {
            generateStructure = false;
        }

        if (commandOptions.full && generateStructure) {
            generateBaseFiles();
            createIEFolder();
            createAssetsFolder();
            createDataFolder();
            generateStructure = false;
        }

        if (commandOptions.basic && generateStructure) {
            generateBaseFiles();
        }

        if (commandOptions.assets && generateStructure) {
            createAssetsFolder();
        }

        if (commandOptions.data && generateStructure) {
            createDataFolder();
        }

        if (commandOptions.ie && generateStructure) {
            createIEFolder();
        }

        tarsUtils.tarsSay(chalk.green('Module "' + newModuleName + '" has been added to markup/modules.\n'), true);
    });
}

/**
 * Create module with structure based on answers from promt
 * @param  {Object} answers Answers from promt
 */
function createModuleWithPromt(answers) {

    fs.mkdir(nmd, function () {
        if (answers.mode.indexOf(' Just empty dir, without files') > -1) {
            void(0);
        } else if (answers.mode.indexOf(' Full pack (all available folders and files)') > -1) {
            generateBaseFiles();
            createIEFolder();
            createAssetsFolder();
            createDataFolder();
        } else {
            answers.mode.forEach(function (mode) {
                switch (mode) {
                    case ' Basic files (js, html and stylies)': {
                        generateBaseFiles();
                        break;
                    }
                    case ' Assets dir': {
                        createAssetsFolder();
                        break;
                    }
                    case ' IE dir': {
                        createIEFolder();
                        break;
                    }
                    case ' Data dir': {
                        createDataFolder();
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
        }

        tarsUtils.tarsSay(chalk.green('Module "' + newModuleName + '" has been added to markup/modules.\n'), true);
    });
}

/**
 * Create module in markup directory
 * @param  {String} moduleName The name of new module
 * @param  {Object} opts       Options
 */
module.exports = function addModule(moduleName, options) {
    var validateStatus = tarsUtils.validateFolderName(moduleName);

    console.log('\n');

    // If moduleName has depricated symbols, log the error
    if (typeof validateStatus === 'string') {
        tarsUtils.tarsSay(chalk.red(validateStatus + '\n'), true);
        return;
    }

    commandOptions = options;
    newModuleName = moduleName;
    // Path to new module. Includes module name
    nmd = cwd + '/markup/modules/' + newModuleName;
    // Create new module if module with newModuleName is not existed already
    fs.stat(nmd, function (fsErr, stats) {

        if (!stats) {
            if (
                !commandOptions.full && !commandOptions.ie && !commandOptions.assets &&
                !commandOptions.data && !commandOptions.empty && !commandOptions.silent && !commandOptions.basic
            ) {
                addModulePromt(createModuleWithPromt);
            } else {
                createModule();
            }
        } else {
            tarsUtils.tarsSay(chalk.red('Module "' + newModuleName + '" already exists.\n'), true);
        }
    });
};
