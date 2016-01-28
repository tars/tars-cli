'use strict';

const Download = require('download');
const exec = require('child_process').exec;
const fsExtra = require('fs-extra');
const del = require('del');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const tarsUtils = require('../utils');
const cwd = process.cwd();
const backupVersionGenerator = require(cwd + '/tars/helpers/set-build-version');
const backupFolderName = `${path.parse(cwd).name}-backup${backupVersionGenerator()}`;

const currentTarsConfig = tarsUtils.getTarsConfig();
const currentTarsVersion = tarsUtils.getTarsProjectVersion();

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
let templaterExtension = 'jade';
const templater = currentTarsConfig.templater.toLowerCase();

if (templater === 'handlebars' ||
    templater === 'handelbars' ||
    templater === 'hdb' ||
    templater === 'hb') {
    templaterExtension = 'html';
}

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

function mergePackageJson(acceptor, donor) {

    if (!acceptor.dependencies) {
        acceptor.dependencies = {};
    }

    acceptor.dependencies = Object.assign(
        acceptor.dependencies,
        donor.dependencies
    );

    if (!acceptor.devDependencies) {
        acceptor.devDependencies = {};
    }

    acceptor.devDependencies = Object.assign(
        acceptor.devDependencies,
        donor.devDependencies
    );

    if (!acceptor.optionalDependencies) {
        acceptor.optionalDependencies = {};
    }

    acceptor.optionalDependencies = Object.assign(
        acceptor.optionalDependencies,
        donor.optionalDependencies
    );

    return acceptor;
}

function makeBackup() {
    return new Promise(resolve => {
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

function downloadNewVersion() {
    return new Promise(resolve => {
        downloadFiles('tars', resolve);
    });
}

function downloadNewPreprocessor() {
    return new Promise(resolve => {
        downloadFiles('css', resolve);
    });
}

function downloadNewTemplater() {
    return new Promise(resolve => {
        downloadFiles('templater', resolve);
    });
}

function mergeFiles() {
    return new Promise(resolve => {

        // Обновляем babelrc
        require('./utils/update-babelrc')();

        const babelConfigPath = cwd + '/.babelrc';
        const currentBabelConfig = fsExtra.readJsonSync(babelConfigPath);
        const newBabelConfig = Object.assign(
            currentBabelConfig,
            fsExtra.readJsonSync(`${dest.tars.fullPath}/.babelrc`)
        );

        fs.writeFileSync(babelConfigPath, JSON.stringify(newBabelConfig, null, 2));
        tarsUtils.tarsSay('.babelrc has been updated.');

        // Обновляем tars.json
        const tarsJsonPath = cwd + '/tars.json';
        const currentTarsJson = require(tarsJsonPath);
        const newTarsJson = Object.assign(
            currentTarsJson,
            require(`${dest.tars.fullPath}/tars.json`)
        );

        fs.writeFileSync(tarsJsonPath, JSON.stringify(newTarsJson, null, 4));
        tarsUtils.tarsSay('tars.json has been updated.');

        // Обновляем tars-config
        const newTarsConfig = Object.assign(
            currentTarsConfig,
            require(`${dest.tars.fullPath}/tars-config`),
            {
                /* eslint-disable no-undefined */

                staticPrefixForCss: undefined

                /* eslint-enable no-undefined */
            }
        );
        const newTarsConfigContent = `module.exports = ${JSON.stringify(newTarsConfig, null, 4)};`;

        fs.writeFileSync(cwd + '/tars-config.js', newTarsConfigContent);
        tarsUtils.tarsSay('tars-config has been updated.');

        // Обновляем eslintrc, если требуется
        if (currentTarsVersion > '1.6.0') {
            const eslintrcPath = cwd + '/.eslintrc';
            const currentEslintrc = require(eslintrcPath);
            const newEslintrc = Object.assign(
                currentEslintrc,
                require(`${dest.tars.fullPath}/.eslintrc`)
            );

            fs.writeFileSync(eslintrcPath, JSON.stringify(newEslintrc, null, 2));
            tarsUtils.tarsSay('.eslintrc has been updated.');
        }

        // Обновляем package.json, только dependencies, devDependencies и optionalDependencies
        const packageJsonPath = cwd + '/package.json';
        let currentUserPackageJson;
        let newUserPackageJson;
        let newPackageJson = Object.assign(
            {},
            fsExtra.readJsonSync(packageJsonPath)
        );

        newPackageJson.dependencies.gulp = '3.9.0';

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

function updatesForJs() {
    return new Promise(resolve => {

        fsExtra.copy(
            `${dest.tars.fullPath}/markup/${currentTarsConfig.fs.staticFolderName}/js/separate-js`,
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

function finalActions() {
    console.log('\n');
    tarsUtils.tarsSay(chalk.green('Your project has been updated successfully!'));
    tarsUtils.tarsSay('Current version is: ' + tarsUtils.getTarsProjectVersion());
    tarsUtils.tarsSay(chalk.yellow('Do not forget to check gulpfile.js, system task and watchers if you have changed it.'));
    tarsUtils.tarsSay(`Folder with backup of your project: "${chalk.cyan(backupFolderName)}"`);
    tarsUtils.tarsSay('Have a nice work =).', true);
}

function actionsOnError(error) {
    console.log('\n');
    removeUselessFiles(true);
    tarsUtils.tarsSay(chalk.red('Something is gone wrong...'));
    tarsUtils.tarsSay(`Folder with backup of your project: "${chalk.cyan(backupFolderName)}"`);
    tarsUtils.tarsSay('Please, repost the message and the stack trace of Error to developer tars.builder@gmail.com', true);
    console.error(error.stack);
}

function startUpdateProcess() {
    Promise
        .all([
            downloadNewVersion(),
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

    // Проверить, что обновление возможно и вывести предупреждение о том, что будет удалено
    if (currentTarsVersion === '1.6.0') {
        tarsUtils.tarsSay('You have the latest version of TARS already!', true);
        return false;
    } else if (currentTarsVersion < '1.5.0') {
        tarsUtils.tarsSay('I\'m so sad, but automatic update is available from version 1.5.0');
        tarsUtils.tarsSay('Current version is: ' + currentTarsVersion, true);
        return false;
    } else {
        tarsUtils.tarsSay('Ok, let\'s do it!');
        startUpdateProcess();
    }

};
