'use strict';

const fs = require('fs');
const fsExtra = require('fs-extra');
const chalk = require('chalk');
const addComponentPromt = require('../promt/add-component-promt');
const tarsUtils = require('../utils');
const addComponentdPromtOptions = require('../constants').ADD_COMPONENT;
const cwd = process.cwd();
const tarsConfig = tarsUtils.getTarsConfig();
const getTemplaterExtension = require('./utils/get-templater-extension');
const templater = tarsConfig.templater.toLowerCase();
const cssPreprocessor = tarsConfig.cssPreprocessor.toLowerCase();
// modules — fallback for old version of tars
const componentsFolderName = tarsConfig.fs.componentsFolderName || 'modules';

const extensions = {
    tpl: getTemplaterExtension(templater),
    css: cssPreprocessor === 'stylus' ? 'styl' : cssPreprocessor
};
let ncd;
let newComponentName;

/**
 * Generate base files for component. Js, Html and Css file
 */
function generateBaseFiles() {
    const newComponentFolder = `${ncd}/${newComponentName}`;

    fs.appendFileSync(`${newComponentFolder}.${extensions.css}`, '\n');
    fs.appendFileSync(`${newComponentFolder}.js`, '\n');
    fs.appendFileSync(`${newComponentFolder}.${extensions.tpl}`, '\n');

    if (extensions.tpl === 'jade') {
        fs.writeFileSync(
            `${newComponentFolder}.${extensions.tpl}`,
            `mixin ${newComponentName}(data)\n    .${newComponentName}`
        );
    }
}

/**
 * Create folder for IE's stylies
 */
function createIEFolder() {
    fs.mkdirSync(ncd + '/ie');
}

/**
 * Create folder for assets
 */
function createAssetsFolder() {
    fs.mkdirSync(ncd + '/assets');
}

/**
 * Create folder for data
 */
function createDataFolder() {
    let processedComponentName = newComponentName;
    let dataFileContent = '';

    if (processedComponentName.indexOf('-') > -1) {
        processedComponentName = '\'' + processedComponentName + '\'';
    }

    if (tarsUtils.getTarsProjectVersion() >= '1.6.0') {
        dataFileContent = `data = {${processedComponentName}: {}};`;
    } else {
        dataFileContent = `${processedComponentName}: {}`;
    }

    fs.mkdirSync(ncd + '/data');
    fs.appendFileSync(ncd + '/data/data.js', '\n');

    fs.writeFileSync(
        ncd + '/data/data.js',
        dataFileContent
    );
}

function successLog() {
    tarsUtils.tarsSay(chalk.green(`Component "${newComponentName}" has been added to markup/${componentsFolderName}.\n`), true);
}

function createCopyOfTemplate() {
    fsExtra.copy(`${cwd}/markup/${componentsFolderName}/_template`, ncd, error => {

        if (error) {
            tarsUtils.tarsSay(
                chalk.red(`_template component does not exist in the "markup/${componentsFolderName}" directory.`)
            );
            tarsUtils.tarsSay('This folder is used as template for new component.');
            tarsUtils.tarsSay(
                `Create template or run the command
                ${chalk.cyan('"tars add-component <componentName>"')}
                to create component with another options.\n`,
                true
            );
        } else {
            successLog();
        }
    });
}

/**
 * Create component with structure based on command options
 * @param {Object} commandOptions
 */
function createComponent(commandOptions) {
    if (commandOptions.template) {
        createCopyOfTemplate();
    } else {
        fs.mkdir(ncd, () => {
            let generateStructure = true;

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

            successLog();
        });
    }
}

/**
 * Create component with structure based on answers from promt
 * @param  {Object} answers Answers from promt
 */
function createComponentWithPromt(answers) {

    if (answers.mode.indexOf(addComponentdPromtOptions.template) > -1) {
        createCopyOfTemplate();
    } else {
        fs.mkdir(ncd, () => {
            if (answers.mode.indexOf(addComponentdPromtOptions.empty) > -1) {
                void 0;
            } else if (answers.mode.indexOf(addComponentdPromtOptions.full) > -1) {
                generateBaseFiles();
                createIEFolder();
                createAssetsFolder();
                createDataFolder();
            } else {
                answers.mode.forEach(mode => {
                    switch (mode) {
                        case addComponentdPromtOptions.assets:
                            createAssetsFolder();
                            break;
                        case addComponentdPromtOptions.ie:
                            createIEFolder();
                            break;
                        case addComponentdPromtOptions.data:
                            createDataFolder();
                            break;
                        case addComponentdPromtOptions.basic:
                        default:
                            generateBaseFiles();
                            break;
                    }
                });
            }

            successLog();
        });
    }
}

/**
 * Create component in markup directory
 * @param  {String} componentName The name of new component
 * @param  {Object} options       Inquirer options
 */
module.exports = function addComponent(componentName, options) {
    console.log('\n');

    const validateResult = tarsUtils.validateFolderName(componentName);

    // If componentName has depricated symbols, log the error
    if (typeof validateResult === 'string') {
        tarsUtils.tarsSay(chalk.red(validateResult + '\n'), true);
        return;
    }

    newComponentName = componentName;

    const commandOptions = Object.assign({}, options);
    // Path to new component. Includes component name
    ncd = `${cwd}/markup/${componentsFolderName}/${newComponentName}`;
    // Create new component if component with newComponentName is not existed already
    fs.stat(ncd, (fsErr, stats) => {
        if (!stats) {
            if (tarsUtils.getUsedFlags(commandOptions).length) {
                createComponent(commandOptions);
            } else {
                addComponentPromt(createComponentWithPromt);
            }
        } else {
            tarsUtils.tarsSay(chalk.red(`Component "${newComponentName}" already exists.\n`), true);
        }
    });
};
