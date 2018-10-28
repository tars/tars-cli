'use strict';

const fs = require('fs');
const fsExtra = require('fs-extra');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const del = require('del');
const addComponentPromt = require('../promt/add-component-promt');
const tarsUtils = require('../utils');
const currentTarsVersion = tarsUtils.getTarsProjectVersion();
const addComponentdPromtOptions = require('../constants').ADD_COMPONENT;
const cwd = process.cwd();
const tarsConfig = tarsUtils.getTarsConfig();
const getTemplaterExtension = require('./utils/get-templater-extension');
const templater = tarsConfig.templater.toLowerCase();
const cssPreprocessor = tarsConfig.cssPreprocessor.toLowerCase();
// modules — fallback for old version of tars
const componentsFolderName = tarsConfig.fs.componentsFolderName || 'modules';
const semver = require('semver');

const extensions = {
    tpl: getTemplaterExtension(templater),
    css: cssPreprocessor === 'stylus' ? 'styl' : cssPreprocessor
};
let newComponentName;

function actionsOnError(error, newComponentPath) {
    console.log('\n');
    del.sync(newComponentPath);
    tarsUtils.tarsSay(chalk.red('Something is gone wrong...'));
    tarsUtils.tarsSay('Please, repost the message and the stack trace of Error to developer tars.builder@gmail.com', true);
    console.error(error.stack);
}

function getNewComponentPath(customPath) {
    let newComponentPath = `${cwd}/markup/${componentsFolderName}/`;

    // Path to new component. Includes component name
    if (customPath && semver.cmp(currentTarsVersion, '>=', '1.8.0')) {
        newComponentPath += `${customPath}/${newComponentName}`;
    } else {
        newComponentPath += newComponentName;
    }

    return newComponentPath;
}

function isComponentExist(newComponentPath) {
    // Create new component if component with newComponentName is not existed already
    try {
        fs.statSync(newComponentPath);
    } catch (error) {
        return false;
    }

    tarsUtils.tarsSay(chalk.red(`Component "${newComponentPath}" already exists.\n`), true);
    return true;
}

/**
 * Generate base files for component. Js, Html and Css file
 * @param {String} newComponentPath Path to new component
 */
function generateBaseFiles(newComponentPath) {
    const newComponentFolder = `${newComponentPath}/${newComponentName}`;

    fs.appendFileSync(`${newComponentFolder}.${extensions.css}`, '\n');
    fs.appendFileSync(`${newComponentFolder}.js`, '\n');
    fs.appendFileSync(`${newComponentFolder}.${extensions.tpl}`, '\n');

    if (extensions.tpl === 'jade' || extensions.tpl === 'pug') {
        fs.writeFileSync(
            `${newComponentFolder}.${extensions.tpl}`,
            `mixin ${newComponentName}(data)\n    .${newComponentName}`
        );
    }
}

/**
 * Create folder for IE's stylies
 * @param {String} newComponentPath Path to new component
 */
function createIEFolder(newComponentPath) {
    fs.mkdirSync(newComponentPath + '/ie');
}

/**
 * Create folder for assets
 * @param {String} newComponentPath Path to new component
 */
function createAssetsFolder(newComponentPath) {
    fs.mkdirSync(newComponentPath + '/assets');
}

/**
 * Create folder for data
 * @param {String} newComponentPath Path to new component
 */
function createDataFolder(newComponentPath) {
    let processedComponentName = newComponentName;
    let dataFileContent = '';

    if (processedComponentName.indexOf('-') > -1) {
        processedComponentName = '\'' + processedComponentName + '\'';
    }

    if (semver.cmp(tarsUtils.getTarsProjectVersion(), '>=', '1.6.0')) {
        dataFileContent = `var data = {${processedComponentName}: {}};`;
    } else {
        dataFileContent = `${processedComponentName}: {}`;
    }

    fs.mkdirSync(newComponentPath + '/data');
    fs.appendFileSync(newComponentPath + '/data/data.js', '\n');

    fs.writeFileSync(
        newComponentPath + '/data/data.js',
        dataFileContent
    );
}

function successLog(customPath) {
    let newComponentPath = `markup/${componentsFolderName}`;

    if (customPath) {
        newComponentPath += `/${customPath}`;
    }

    tarsUtils.tarsSay(chalk.green(`Component "${newComponentName}" has been added to ${newComponentPath}.\n`), true);
}

function createCopyOfTemplate(newComponentPath, customPath) {
    fsExtra.copy(`${cwd}/markup/${componentsFolderName}/_template`, newComponentPath, error => {

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
            successLog(customPath);
        }
    });
}

function createComponentByScheme(newComponentPath, params) {
    params = params || {};

    function parseScheme(schemeConfig) {
        return new Promise(resolve => {
            const stringifiedConfig = JSON.stringify(schemeConfig);
            const processedConfig = stringifiedConfig
                .replace(/__componentName__/g, newComponentName)
                .replace(/__templateExtension__/g, extensions.tpl)
                .replace(/__cssExtension__/g, extensions.css);


            const processedConfigObject = JSON.parse(processedConfig);
            resolve(processedConfigObject);
        });
    }

    function loadSchemeFile() {
        return new Promise((resolve, reject) => {
            let schemeFilePath = `${cwd}/markup/${tarsConfig.fs.componentsFolderName}/${params.schemeFile}`;

            if (schemeFilePath.indexOf('.json') === -1) {
                schemeFilePath += '.json';
            }

            fsExtra.readJson(schemeFilePath, (error, schemeConfig) => {
                if (error) {
                    return reject(error);
                }

                resolve(schemeConfig);
            });
        });
    }

    function writeFiles(path, files) {
        files.map(file => {
            try {
                fs.writeFileSync(
                    `${path}/${file.name}`,
                    file.content
                );
            } catch (error) {
                throw new Error(error);
            }
        });
    }

    function processFolders(path, folders) {
        folders.map(folder => {
            const folderPath = `${path}/${folder.name}`;
            const folderFiles = folder.files;
            const folderFolders = folder.folders;

            mkdirp.sync(folderPath);

            if (folderFiles && folderFiles.length) {
                writeFiles(folderPath, folderFiles);
            }

            if (folderFolders && folderFolders.length) {
                processFolders(folderPath, folderFolders);
            }
        });
    }

    function generateComponent(scheme) {
        return new Promise((resolve, reject) => {
            const initialFolders = scheme.folders;
            const initialFiles = scheme.files;

            mkdirp(newComponentPath, error => {
                if (error) {
                    return reject(error);
                }

                try {
                    if (initialFiles && initialFiles.length) {
                        writeFiles(newComponentPath, initialFiles);
                    }

                    if (initialFolders && initialFolders.length) {
                        processFolders(newComponentPath, initialFolders);
                    }
                } catch (generationError) {
                    return reject(generationError);
                }

                resolve();
            });
        });
    }

    Promise.resolve()
        .then(loadSchemeFile)
        .then(parseScheme)
        .then(generateComponent)
        .then(() => {
            successLog(params.customPath);
        })
        .catch(error => {
            actionsOnError(error, newComponentPath);
        });
}

/**
 * Create component with structure based on command options
 * @param {Object} commandOptions Options, which is passed from CLI
 */
function createComponent(commandOptions) {
    // Path to new component. Includes component name
    const newComponentPath = getNewComponentPath(commandOptions.customPath);

    if (isComponentExist(newComponentPath)) {
        return;
    }

    if (commandOptions.scheme && semver.cmp(currentTarsVersion, '>=', '1.8.0')) {
        if (commandOptions.scheme && typeof commandOptions.scheme === 'boolean') {
            commandOptions.scheme = '';
        }

        createComponentByScheme(
            newComponentPath,
            {
                schemeFile: commandOptions.scheme || 'default_component_scheme.json',
                customPath: commandOptions.customPath
            }
        );
        return;
    }

    if (commandOptions.template) {
        createCopyOfTemplate(newComponentPath, commandOptions.customPath);
        return;
    }

    mkdirp(newComponentPath, error => {
        if (error) {
            return actionsOnError(error, newComponentPath);
        }

        let generateStructure = true;

        try {
            if (commandOptions.empty) {
                generateStructure = false;
            }

            if (commandOptions.full && generateStructure) {
                generateBaseFiles(newComponentPath);
                createIEFolder(newComponentPath);
                createAssetsFolder(newComponentPath);
                createDataFolder(newComponentPath);
                generateStructure = false;
            }

            if (commandOptions.basic && generateStructure) {
                generateBaseFiles(newComponentPath);
            }

            if (commandOptions.assets && generateStructure) {
                createAssetsFolder(newComponentPath);
            }

            if (commandOptions.data && generateStructure) {
                createDataFolder(newComponentPath);
            }

            if (commandOptions.ie && generateStructure) {
                createIEFolder(newComponentPath);
            }
        } catch (generationError) {
            return actionsOnError(generationError, newComponentPath);
        }

        successLog(commandOptions.customPath);
    });
}

/**
 * Create component with structure based on answers from promt
 * @param  {Object} answers Answers from promt
 */
function createComponentWithPromt(answers) {
    // Path to new component. Includes component name
    const newComponentPath = getNewComponentPath(answers.customPath);

    if (isComponentExist(newComponentPath)) {
        return;
    }

    if (answers.mode.indexOf(addComponentdPromtOptions.scheme.title) > -1) {
        createComponentByScheme(
            newComponentPath,
            {
                schemeFile: answers.scheme,
                customPath: answers.customPath
            }
        );
        return;
    }

    if (answers.mode.indexOf(addComponentdPromtOptions.template.title) > -1) {
        createCopyOfTemplate(newComponentPath);
        return successLog(answers.customPath);
    }

    mkdirp(newComponentPath, error => {
        if (error) {
            return actionsOnError(error, newComponentPath);
        }

        try {
            if (answers.mode.indexOf(addComponentdPromtOptions.empty.title) > -1) {
                void 0;
            } else if (answers.mode.indexOf(addComponentdPromtOptions.full.title) > -1) {
                generateBaseFiles(newComponentPath);
                createIEFolder(newComponentPath);
                createAssetsFolder(newComponentPath);
                createDataFolder(newComponentPath);
            } else {
                answers.mode.forEach(mode => {
                    console.log(mode);
                    switch (mode) {
                        case addComponentdPromtOptions.assets.title:
                            createAssetsFolder(newComponentPath);
                            break;
                        case addComponentdPromtOptions.ie.title:
                            createIEFolder(newComponentPath);
                            break;
                        case addComponentdPromtOptions.data.title:
                            createDataFolder(newComponentPath);
                            break;
                        case addComponentdPromtOptions.basic.title:
                        default:
                            generateBaseFiles(newComponentPath);
                            break;
                    }
                });
            }
        } catch (generationError) {
            return actionsOnError(generationError, newComponentPath);
        }

        return successLog(answers.customPath);
    });
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

    if (tarsUtils.getUsedFlags(commandOptions).length) {
        createComponent(commandOptions);
    } else {
        addComponentPromt(createComponentWithPromt);
    }
};
