'use strict';

const Download = require('download');
const exec = require('child_process').exec;
const fsExtra = require('fs-extra');
const del = require('del');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const tarsUtils = require('../utils');
const getTemplaterExtension = require('./utils/get-templater-extension');
const cwd = process.cwd();
const backupVersionGenerator = require(cwd + '/tars/helpers/set-build-version');
const backupFolderName = `${path.parse(cwd).name}-backup${backupVersionGenerator()}`;

const currentTarsConfig = tarsUtils.getTarsConfig();
const currentTarsVersion = tarsUtils.getTarsProjectVersion();

const templater = currentTarsConfig.templater.toLowerCase();
const templaterExtension = getTemplaterExtension(templater);

let urls = {
    tars: 'https://github.com/tars/tars/archive/master.zip',
    css: 'https://github.com/tars/tars-' + currentTarsConfig.cssPreprocessor + '/archive/master.zip',
    templater: 'https://github.com/tars/tars-' + currentTarsConfig.templater + '/archive/master.zip'
};
let dest = {
    tars: {
        root: cwd + '/__tars',
        fullPath: cwd + '/__tars'
    },
    css: {
        root: cwd + '/__css',
        fullPath: cwd + '/__css'
    },
    templater: {
        root: cwd + '/__templater',
        fullPath: cwd + '/__css'
    }
};
let isNeededToReinstallPackages = false;
let commandOptions = {};

/**
 * Download files for update
 * @param  {String}   type     What type of files to download
 * @param  {Function} callback Callback after downloading
 */
function downloadFiles(type, callback) {
    new Download({ extract: true, mode: '755' })
        .get(urls[type])
        .dest(dest[type].root)
        .run((error, files) => {
            if (error) {
                throw new Error(error);
            }

            dest[type].fullPath = cwd + files[0].path.substr(cwd.length);
            callback();
        });
}

/**
 * Merge dependencies from one package.json to another
 * @param  {Object} acceptor Object for merging
 * @param  {Object} donor    Object — provider of deps
 * @return {Object}          Processed object
 */
function mergePackageJson(acceptor, donor) {
    const keys = Object.keys(donor);

    keys.forEach(key => {
        if (!acceptor[key]) {
            acceptor[key] = {};
        }

        acceptor[key] = Object.assign(
            acceptor[key],
            donor[key]
        );
    });

    return acceptor;
}

/**
 * Just makes backup of current project
 * @return {Promise}
 */
function makeBackup() {
    return new Promise(resolve => {

        tarsUtils.tarsSay('Please, wait for a minute, while I\'m creating backup of your current project...');
        tarsUtils.tarsSay('You can get a cup of coffee or tea =)');

        fsExtra.copy(cwd, `${cwd}/${backupFolderName}`,
            {
                filter: source => {
                    const resultIndexOf = source.indexOf(`${path.parse(cwd).name}-backup`)
                        + source.indexOf('__tars') + source.indexOf('__css')
                        + source.indexOf('__templater');

                    if (resultIndexOf > -4) {
                        return false;
                    }

                    return true;
                }
            },
            error => {
                if (error) {
                    throw new Error(error);
                }

                tarsUtils.tarsSay(
                    `Backup has been created. Folder name is: "${chalk.cyan(backupFolderName)}"`
                );
                resolve();
            }
        );
    });
}

/**
 * Downloads new version of TARS
 * @return {Promise}
 */
function downloadNewVersion() {
    return new Promise(resolve => {
        downloadFiles('tars', resolve);
    });
}

/**
 * Downloads new version of css-preprocessor
 * @return {Promise}
 */
function downloadNewPreprocessor() {
    return new Promise(resolve => {
        downloadFiles('css', resolve);
    });
}

/**
 * Downloads new version of templater
 * @return {Promise}
 */
function downloadNewTemplater() {
    return new Promise(resolve => {
        downloadFiles('templater', resolve);
    });
}

/**
 * Merge configs
 * @return {Promise}
 */
function mergeFiles() {
    return new Promise(resolve => {

        // tars.json update
        const tarsJsonPath = cwd + '/tars.json';
        const currentTarsJson = require(tarsJsonPath);
        const newTarsJson = Object.assign(
            currentTarsJson,
            require(`${dest.tars.fullPath}/tars.json`)
        );

        fs.writeFileSync(tarsJsonPath, JSON.stringify(newTarsJson, null, 4));
        tarsUtils.tarsSay('tars.json has been updated.');

        // tars-config update
        const svgConfig = currentTarsConfig.svg;
        const newTarsConfig = Object.assign(
            currentTarsConfig,
            {
                /* eslint-disable no-undefined */

                staticPrefixForCss: undefined,
                useSVG: undefined,

                /* eslint-enable no-undefined */

                svg: svgConfig || {
                    active: currentTarsConfig.useSVG,
                    workflow: 'sprite',
                    symbolsConfig: {
                        loadingType: 'inject',
                        usePolyfillForExternalSymbols: true,
                        pathToExternalSymbolsFile: ''
                    }
                }
            }
        );
        const newTarsConfigContent = `module.exports = ${JSON.stringify(newTarsConfig, null, 4)};`;

        fs.writeFileSync(cwd + '/tars-config.js', newTarsConfigContent);
        tarsUtils.tarsSay('tars-config has been updated.');

        // .babelrc update
        require('./utils/update-babelrc')();

        if (currentTarsConfig.useBabel) {
            const babelConfigPath = cwd + '/.babelrc';
            let newBabelConfig = fsExtra.readJsonSync(babelConfigPath);

            newBabelConfig.ignore = newBabelConfig.ignore
                .concat(
                    fsExtra.readJsonSync(`${dest.tars.fullPath}/.babelrc`).ignore
                )
                .filter((item, pos, self) => self.indexOf(item) === pos);

            fs.writeFileSync(babelConfigPath, JSON.stringify(newBabelConfig, null, 2));
            tarsUtils.tarsSay('.babelrc has been updated.');
        }

        // .eslintrc copy
        if (currentTarsVersion < '1.6.0') {
            fsExtra.copySync(dest.tars.fullPath + '/.eslintrc', cwd + '/.eslintrc');
        }

        // package.json update. Only dependencies, devDependencies and optionalDependencies
        const packageJsonPath = cwd + '/package.json';
        let currentUserPackageJson;
        let newUserPackageJson;
        let newPackageJson = Object.assign(
            {},
            fsExtra.readJsonSync(packageJsonPath)
        );

        newPackageJson.dependencies.gulp = '3.9.1';

        try {
            currentUserPackageJson = require(cwd + '/user-package.json');
        } catch (error) {
            tarsUtils.tarsSay(chalk.yellow(error.message));
            tarsUtils.tarsSay(chalk.yellow('Will continue without local user-package.json processing'));
            currentUserPackageJson = {};
        }

        try {
            newUserPackageJson = require(dest.tars.fullPath + '/user-package.json');
        } catch (error) {
            tarsUtils.tarsSay(chalk.yellow(error.message));
            tarsUtils.tarsSay(chalk.yellow('Will continue new local user-package.json processing'));
            newUserPackageJson = {};
        }

        newPackageJson = mergePackageJson(newPackageJson, currentUserPackageJson);
        newPackageJson = mergePackageJson(newPackageJson, newUserPackageJson);

        if (JSON.stringify(newPackageJson) !== JSON.stringify(require(packageJsonPath))) {
            isNeededToReinstallPackages = true;
            fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
            tarsUtils.tarsSay('package.json has been updated.');
        }

        tarsUtils.tarsSay('All config-files have been updated.');
        resolve();
    });
}

/**
 * Update system tasks, helpers and main tars.js
 * @return {Promise}
 */
function updateTasksAndHelpers() {
    return new Promise(resolve => {
        const currentTasksPath = cwd + '/tars/tasks';
        const currentWatchersPath = cwd + '/tars/watchers';
        const currentHelpersPath = cwd + '/tars/helpers';
        const currentTarsJsPath = cwd + '/tars/tars.js';
        const pathsToDel = [
            currentTasksPath,
            currentWatchersPath,
            currentHelpersPath,
            currentTarsJsPath
        ];

        del.sync(pathsToDel);

        try {
            fsExtra.copySync(dest.tars.fullPath + '/tars/tasks', currentTasksPath);
            fsExtra.copySync(dest.tars.fullPath + '/tars/watchers', currentWatchersPath);
            fsExtra.copySync(dest.tars.fullPath + '/tars/helpers', currentHelpersPath);
            fsExtra.copySync(dest.tars.fullPath + '/tars/tars.js', currentTarsJsPath);
            fsExtra.copySync(
                dest.tars.fullPath + '/tars/user-tasks/example-task.js',
                cwd + '/tars/user-tasks/example-task.js'
            );
            fsExtra.copySync(
                dest.tars.fullPath + '/tars/user-watchers/example-watcher.js',
                cwd + '/tars/user-watchers/example-watcher.js'
            );

            if (currentTarsVersion < '1.6.0') {
                fsExtra.copySync(
                    dest.tars.fullPath + '/tars/user-tasks/html',
                    cwd + '/tars/user-tasks/html'
                );
            }
        } catch (copyError) {
            throw new Error(copyError);
        }

        tarsUtils.tarsSay('Tasks, watchers, helpers and tars.js have been updated.');
        resolve();
    });
}

/**
 * Update some css-files
 * @return {Promise}
 */
function updatesForCss() {
    return new Promise(resolve => {

        if (!commandOptions.excludeCss) {
            fsExtra.copy(
                `${dest.css.fullPath}/markup/static/${currentTarsConfig.cssPreprocessor}/sprite-generator-templates`,
                `${cwd}/markup/${currentTarsConfig.fs.staticFolderName}/${currentTarsConfig.cssPreprocessor}/sprite-generator-templates`,
                error => {
                    if (error) {
                        throw new Error(error);
                    }

                    tarsUtils.tarsSay('Style-files have been updated.');
                    resolve();
                }
            );
        } else {
            resolve();
        }
    });
}

/**
 * Update some templater-files
 * @return {Promise}
 */
function updatesForHtml() {
    return new Promise(resolve => {

        if (!commandOptions.excludeHtml) {
            fsExtra.copy(
                `${dest.templater.fullPath}/markup/pages/_template.${templaterExtension}`,
                `${cwd}/markup/pages/_template.${templaterExtension}`,
                error => {
                    if (error) {
                        throw new Error(error);
                    }

                    tarsUtils.tarsSay('Templater-files have been updated.');
                    resolve();
                }
            );
        } else {
            resolve();
        }
    });
}

/**
 * Update some js-files
 * @return {Promise}
 */
function updatesForJs() {
    return new Promise(resolve => {

        fsExtra.copy(
            `${dest.tars.fullPath}/markup/static/js/separate-js`,
            `${cwd}/markup/${currentTarsConfig.fs.staticFolderName}/js/separate-js`,
            error => {
                if (error) {
                    throw new Error(error);
                }

                tarsUtils.tarsSay('JS-files have been updated.');
                resolve();
            }
        );
    });
}

/**
 * Update gulpfule.js
 * @return {Promise}
 */
function gulpfileUpdate() {
    return new Promise(resolve => {
        fsExtra.copy(dest.tars.fullPath + '/gulpfile.js', cwd + '/gulpfile.js', error => {
            if (error) {
                throw new Error(error);
            }

            tarsUtils.tarsSay('Gulpfile has been updated.');
            resolve();
        });
    });
}

/**
 * Update documentation
 * @return {Promise}
 */
function updateDocs() {
    return new Promise(resolve => {
        const currentDocsPath = cwd + '/docs';
        const currentReadmeRu = cwd + '/README_RU.md';
        const currentReadme = cwd + '/README.md';
        const pathsToDel = [
            currentDocsPath,
            currentReadmeRu,
            currentReadme
        ];

        del.sync(pathsToDel);

        try {
            fsExtra.copySync(dest.tars.fullPath + '/docs', currentDocsPath);
            fsExtra.copySync(dest.tars.fullPath + '/README_RU.md', currentReadmeRu);
            fsExtra.copySync(dest.tars.fullPath + '/README.md', currentReadme);
        } catch (copyError) {
            throw new Error(copyError);
        }

        tarsUtils.tarsSay('Documentation has been updated.');
        resolve();
    });
}

/**
 * Install packages, if it is needed
 * @return {Promise}
 */
function installPackages() {
    return new Promise(resolve => {

        if (isNeededToReinstallPackages) {
            exec('npm i', error => {
                if (error) {
                    throw new Error(error);
                } else {
                    tarsUtils.tarsSay('NPM-packages have been updated.');
                    resolve();
                }
            });
        } else {
            tarsUtils.tarsSay('NPM-packages were not changed.');
            resolve();
        }
    });
}

/**
 * Start custom actions from custom-update-actions.json
 * @return {Promise}
 */
function customActions() {
    return new Promise(resolve => {
        let customActionsConfig;

        try {
            customActionsConfig = require(dest.tars.fullPath + '/custom-update-actions.json');
        } catch (error) {
            tarsUtils.tarsSay(chalk.yellow(error.message));
            tarsUtils.tarsSay(chalk.yellow('Will continue without custom-update-actions'));
            return resolve();
        }

        if (customActionsConfig.remove && customActionsConfig.remove.length) {
            customActionsConfig.remove.forEach(itemToRemove => {
                del.sync(cwd + itemToRemove);
            });
        }

        if (customActionsConfig.copy && customActionsConfig.copy.length) {
            customActionsConfig.copy.forEach(itemToCopy => {
                try {
                    fsExtra.copySync(
                        dest.tars.fullPath + itemToCopy.from,
                        cwd + itemToCopy.to
                    );
                } catch (copyError) {
                    tarsUtils.tarsSay(chalk.yellow('Error while coping files from custom-actions'));
                    tarsUtils.tarsSay(chalk.yellow(copyError.message));
                }
            });
        }

        if (customActionsConfig.rename && customActionsConfig.rename.length) {
            customActionsConfig.rename.forEach(itemToRename => {
                try {
                    fs.renameSync(
                        cwd + itemToRename.from,
                        cwd + itemToRename.to
                    );
                } catch (renameError) {
                    tarsUtils.tarsSay(chalk.yellow('Error while renaming files from custom-actions'));
                    tarsUtils.tarsSay(chalk.yellow(renameError.message));
                }
            });
        }

        resolve();
    });
}

 /**
  * Remove all temp files
  * @param  {Boolean} isLogsMuted add log or not
  * @return {Promise}
  */
function removeUselessFiles(isLogsMuted) {
    return new Promise(resolve => {
        const pathsToDel = [
            dest.tars.root,
            dest.css.root,
            dest.templater.root,
            cwd + '/.jscsrc'
        ];

        del.sync(pathsToDel);

        if (!isLogsMuted) {
            tarsUtils.tarsSay('Useless files have been removed.');
        }

        resolve();
    });
}

/**
 * Final log
 */
function finalActions() {
    console.log('\n');
    tarsUtils.tarsSay(chalk.green('Your project has been updated successfully!'));
    tarsUtils.tarsSay('Current version is: ' + tarsUtils.getTarsProjectVersion());
    tarsUtils.tarsSay(chalk.yellow('Do not forget to check gulpfile.js, system task and watchers if you have changed it.'));
    tarsUtils.tarsSay(`Folder with backup of your project: "${chalk.cyan(backupFolderName)}"`);
    tarsUtils.tarsSay('Have a nice work =).', true);
}

/**
 * Start actions, if something is gone wrong
 * @param  {Object} error Object with info about error
 */
function actionsOnError(error) {
    console.log('\n');
    removeUselessFiles(true);
    tarsUtils.tarsSay(chalk.red('Something is gone wrong...'));
    tarsUtils.tarsSay(`Folder with backup of your project: "${chalk.cyan(backupFolderName)}"`);
    tarsUtils.tarsSay('Please, repost the message and the stack trace of Error to developer tars.builder@gmail.com', true);
    console.error(error.stack);
}

/**
 * Just start update process
 */
function startUpdateProcess() {
    Promise
        .all([
            downloadNewPreprocessor(),
            downloadNewTemplater()
        ])
        .then(() => {
            return new Promise(resolve => {
                tarsUtils.tarsSay('New version has been downloaded successfully.');
                tarsUtils.tarsSay('I\'ll wait for 5 seconds to be sure, that all new files on your disk already.');

                setTimeout(() => {
                    resolve();
                }, 5000);
            });
        })
        .then(makeBackup)
        .then(mergeFiles)
        .then(updateTasksAndHelpers)
        .then(updatesForCss)
        .then(updatesForJs)
        .then(updatesForHtml)
        .then(gulpfileUpdate)
        .then(updateDocs)
        .then(installPackages)
        .then(customActions)
        .then(removeUselessFiles)
        .then(finalActions)
        .catch(actionsOnError);
}

module.exports = function updateProject(options) {
    tarsUtils.spinner.start();

    commandOptions = options;

    if (options.source) {
        urls.tars = options.source;
    }

    if (currentTarsVersion < '1.5.0') {
        tarsUtils.tarsSay('I\'m so sad, but automatic update is available from version 1.5.0');
        tarsUtils.tarsSay('Current version is: ' + currentTarsVersion, true);
        return false;
    }

    tarsUtils.tarsSay('Checking, that update is available for you...');

    downloadNewVersion()
        .then(() => {
            const downloadedVersion = require(`${dest.tars.fullPath}/tars.json`).version;

            if (currentTarsVersion === downloadedVersion && !commandOptions.force) {
                tarsUtils.tarsSay('You have the latest version of TARS already!', true);
                removeUselessFiles(true);
                return;
            }

            if (commandOptions.force) {
                tarsUtils.tarsSay(`Force update!`);
            } else {
                tarsUtils.tarsSay(`Ok, new version "${downloadedVersion}" is available. Let's do it!`);
            }

            startUpdateProcess();
        })
        .catch(error => {
            tarsUtils.tarsSay(chalk.red('Something is gone wrong...'));
            tarsUtils.tarsSay('Files in your project have not been changed');
            tarsUtils.tarsSay('Please, repost the message and the stack trace of Error to developer tars.builder@gmail.com', true);
            console.error(error.stack);
        });
};
