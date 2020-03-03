import { AbstractAction } from './abstract.action';
const Download = require('download');
const exec = require('child_process').exec;
const fsExtra = require('fs-extra');
const del = require('del');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const semver = require('semver');

import { spinner } from '../ui';
import {
  tarsSay,
  getTarsConfig as currentTarsConfig,
  getTarsProjectVersion as currentTarsVersion,
} from '../utils';
const getTemplaterExtension = require('./utils/get-templater-extension');
const cwd = process.cwd();
const backupVersionGenerator = require(`${cwd}/tars/helpers/set-build-version`);
const backupFolderName = `${
  path.parse(cwd).name
}-backup${backupVersionGenerator()}`;

// @ts-ignore
const templater = currentTarsConfig.templater.toLowerCase();
const templaterExtension = getTemplaterExtension(templater);
const componentsFolderName =
  // @ts-ignore
  currentTarsConfig.fs.componentsFolderName || 'modules';

let downloadedVersion: string;

let urls = {
  tars: 'https://github.com/tars/tars/archive/master.zip',
  css: `https://github.com/tars/tars-${currentTarsConfig.cssPreprocessor}/archive/master.zip`,
  templater: `https://github.com/tars/tars-${currentTarsConfig.templater}/archive/master.zip`,
};
let dest = {
  tars: {
    root: `${cwd}/__tars`,
    fullPath: `${cwd}/__tars`,
  },
  css: {
    root: `${cwd}/__css`,
    fullPath: `${cwd}/__css`,
  },
  templater: {
    root: `${cwd}/__templater`,
    fullPath: `${cwd}/__css`,
  },
};
let isNeededToReinstallPackages = false;
let commandOptions = {};

export class UpdateProjectAction extends AbstractAction {
  // @ts-ignore
  public async handle(options: any) {
    const installedTarsCliVersion = require(`${process.env.cliRoot}/package.json`)
      .version;

    spinner.start();

    commandOptions = Object.assign({}, options);

    if (options.source) {
      urls.tars = options.source;
    }

    if (semver.cmp(currentTarsVersion, '<', '1.5.0')) {
      tarsSay(
        "I'm so sad, but automatic update is available from version 1.5.0 only!",
      );
      tarsSay(`Current version is: ${currentTarsVersion}`, true);
      return false;
    }

    tarsSay('Checking, if update is available for you...');

    new Download({ extract: true, mode: '755' })
      .get(
        'https://raw.githubusercontent.com/tars/tars-cli/master/package.json',
      )
      .run((error: any, files: any) => {
        if (error) {
          tarsSay('Something is gone wrong! Please, try again later.', true);

          throw new Error(error);
        }

        const latestTarsCliVersion = JSON.parse(files[0].contents.toString())
          .version;

        if (semver.cmp(installedTarsCliVersion, '<', latestTarsCliVersion)) {
          tarsSay('Version of installed TARS-CLI is not the latest!');
          tarsSay(
            `Please, update TARS-CLI via ${chalk.cyan.bold(
              'tars update',
            )} at first!`,
          );
          tarsSay(
            `The latest version is: ${chalk.cyan.bold(latestTarsCliVersion)}`,
          );
          tarsSay(
            `Installed version is: ${chalk.cyan.bold(installedTarsCliVersion)}`,
            true,
          );
          return false;
        }

        this.downloadNewVersion()
          .then(() => {
            downloadedVersion = require(`${dest.tars.fullPath}/tars.json`)
              .version;

            if (
              semver.cmp(currentTarsVersion, '=', downloadedVersion) &&
              // @ts-ignore
              !commandOptions.force
            ) {
              tarsSay('You have the latest version of TARS already!', true);
              this.removeUselessFiles(true);
              return;
            }

            // @ts-ignore
            if (commandOptions.force) {
              tarsSay('Force update!');
            } else {
              tarsSay(
                `Ok, new version ${chalk.cyan.bold(
                  downloadedVersion,
                )} is available. Let's do it!`,
              );
            }

            this.startUpdateProcess();
          })
          .catch(downloadError => {
            tarsSay(chalk.red('Something is gone wrong...'));
            tarsSay('Files in your project have not been changed');
            tarsSay(
              'Please, repost the message and the stack trace of Error to developer tars.builder@gmail.com',
              true,
            );
            console.error(downloadError.stack);
          });
      });
  }

  /**
   * Download files for update
   * @param  {String}   type     What type of files to download
   * @param  {Function} callback Callback after downloading
   */
  private downloadFiles(type: any, callback: any) {
    new Download({ extract: true, mode: '755' })
      // @ts-ignore
      .get(urls[type])
      // @ts-ignore
      .dest(dest[type].root)
      // @ts-ignore
      .run((error, files) => {
        if (error) {
          throw new Error(error);
        }
        // @ts-ignore
        dest[type].fullPath = `${cwd}${files[0].path.substr(cwd.length)}`;
        callback();
      });
  }

  /**
   * Just makes backup of current project
   * @return {Promise}
   */
  private makeBackup() {
    return new Promise(resolve => {
      tarsSay(
        "Please, wait for a minute, while I'm creating backup of your current project...",
      );
      tarsSay('You can get a cup of coffee or tea =)');
      const backupPath = path.resolve(cwd, '../', `${backupFolderName}`);

      fsExtra.copy(
        cwd,
        backupPath,
        {
          filter: (source: any) => {
            const resultIndexOf =
              source.indexOf(`${path.parse(cwd).name}-backup`) +
              source.indexOf('__tars') +
              source.indexOf('__css') +
              source.indexOf('__templater');

            if (resultIndexOf > -4) {
              return false;
            }

            return true;
          },
        },
        (error: any) => {
          if (error) {
            throw new Error(error);
          }

          try {
            fsExtra.moveSync(backupPath, `${cwd}/backup/${backupFolderName}`);
          } catch (err) {
            throw new Error(err);
          }

          tarsSay(
            `Backup has been created. Dir name is: "${chalk.cyan(
              backupFolderName,
            )}" in backup dir`,
          );
          resolve();
        },
      );
    });
  }

  /**
   * Downloads new version of TARS
   * @return {Promise}
   */
  private downloadNewVersion() {
    return new Promise(resolve => {
      this.downloadFiles('tars', resolve);
    });
  }

  /**
   * Downloads new version of css-preprocessor
   * @return {Promise}
   */
  private downloadNewPreprocessor() {
    return new Promise(resolve => {
      this.downloadFiles('css', resolve);
    });
  }

  /**
   * Downloads new version of templater
   * @return {Promise}
   */
  private downloadNewTemplater() {
    return new Promise(resolve => {
      this.downloadFiles('templater', resolve);
    });
  }

  /**
   * Update config files for TARS, Eslint and so on
   * @return {Promise}
   */
  private updateConfigFiles() {
    return new Promise(resolve => {
      /**
       * START tars.json update
       */
      const tarsJsonPath = `${cwd}/tars.json`;
      const currentTarsJson = require(tarsJsonPath);
      const newTarsJson = Object.assign(
        currentTarsJson,
        require(`${dest.tars.fullPath}/tars.json`),
      );

      fs.writeFileSync(tarsJsonPath, JSON.stringify(newTarsJson, null, 4));
      tarsSay('tars.json has been updated.');
      /**
       * END tars.json update
       */

      /**
       * START update plugins-config.js
       */
      const downloadedPluginsConfigString = fs
        .readFileSync(`${dest.tars.fullPath}/plugins-config.json`)
        .toString();
      let currentPluginsConfigString;

      if (semver.cmp(currentTarsVersion, '>', '1.8.0')) {
        currentPluginsConfigString = fs
          .readFileSync(`${cwd}/plugins-config.json`)
          .toString();
      }

      const newPluginsConfigString = require('./utils/update-project/update-plugins-config')(
        downloadedPluginsConfigString,
        currentPluginsConfigString,
        currentTarsConfig,
        currentTarsVersion,
      );

      fs.writeFileSync(`${cwd}/plugins-config.json`, newPluginsConfigString);
      tarsSay('plugins-config has been created.');

      /**
       * END update plugins-config.js
       */

      /**
       * START update .browserslistrc
       */
      let downloadedBrowserslistrc;
      let currentBrowserslistrc;

      const updateBrowserslistrc = () => {
        if (!fs.existsSync(`${cwd}/.browserslistrc`)) {
          fsExtra.copySync(
            `${dest.tars.fullPath}/.browserslistrc`,
            `${cwd}/.browserslistrc`,
            { clobber: true },
          );
          return;
        }

        downloadedBrowserslistrc = fs.readFileSync(
          `${dest.tars.fullPath}/.browserslistrc`,
        );
        currentBrowserslistrc = fs.readFileSync(`${cwd}/.browserslistrc`);

        if (downloadedBrowserslistrc !== currentBrowserslistrc) {
          fsExtra.copySync(
            `${cwd}/.browserslistrc`,
            `${cwd}/${currentTarsVersion}-browserslistrc`,
            { clobber: true },
          );
          fsExtra.copySync(
            `${dest.tars.fullPath}/.browserslistrc`,
            `${cwd}/.browserslistrc`,
            { clobber: true },
          );
        }
      };

      if (semver.cmp(downloadedVersion, '>', '1.11.8')) {
        updateBrowserslistrc();
      }
      /**
       * END update .browserslistrc
       */

      /**
       * START tars-config.js update
       */
      const newTarsConfig = require('./utils/update-project/tars-config-update')(
        {
          downloadedVersion,
          currentTarsConfig,
        },
      );
      const newTarsConfigContent = `module.exports = ${JSON.stringify(
        newTarsConfig,
        null,
        4,
      )};`;

      fs.writeFileSync(`${cwd}/tars-config.js`, newTarsConfigContent);
      tarsSay('tars-config has been updated.');
      /**
       * END tars-config.js update
       */

      /**
       * START .babelrc update
       */
      require('./utils/update-project/update-babelrc')();

      // Merge existed and downloaded .babelrc
      if (
        // @ts-ignore
        currentTarsConfig.useBabel ||
        // @ts-ignore
        (currentTarsConfig.js && currentTarsConfig.js.useBabel)
      ) {
        const babelConfigPath = `${cwd}/.babelrc`;
        let newBabelConfig = fsExtra.readJsonSync(babelConfigPath);

        newBabelConfig.ignore = newBabelConfig.ignore
          .concat(fsExtra.readJsonSync(`${dest.tars.fullPath}/.babelrc`).ignore)
          // @ts-ignore
          .filter((item, pos, self) => self.indexOf(item) === pos);

        fs.writeFileSync(
          babelConfigPath,
          JSON.stringify(newBabelConfig, null, 2),
        );
        tarsSay('.babelrc has been updated.');
      }
      /**
       * END .babelrc update
       */

      /**
       * START .eslintrc update
       */
      const eslintrcPath = `${cwd}/.eslintrc`;
      let currentEslintConfigContent;
      let newEslintConfig;

      try {
        currentEslintConfigContent = fs.readFileSync(eslintrcPath);
      } catch (error) {
        currentEslintConfigContent = null;
      }

      if (currentEslintConfigContent) {
        const currentEslintConfig = JSON.parse(
          currentEslintConfigContent.toString().replace(/\/\/[\s\w]+/gi, ''),
        );

        newEslintConfig = require('./utils/update-project/eslintrc-update')(
          currentEslintConfig,
        );

        fs.writeFileSync(
          eslintrcPath,
          JSON.stringify(newEslintConfig, null, 2),
        );
      } else {
        fsExtra.copySync(`${dest.tars.fullPath}/.eslintrc`, `${cwd}/.eslintrc`);
      }

      tarsSay('.eslintrc has been updated.');

      /**
       * END .eslintrc update
       */

      /**
       * START webpack-config update
       */
      if (semver.cmp(downloadedVersion, '>=', '1.7.0')) {
        try {
          fs.statSync(`${cwd}/webpack.config.js`);
        } catch (error) {
          fsExtra.copySync(
            `${dest.tars.fullPath}/webpack.config.js`,
            `${cwd}/webpack.config.js`,
          );
        }
      }
      /**
       * END webpack-config update
       */

      /**
       * START package.json update
       */
      const packageJsonPath = `${cwd}/package.json`;
      const newPackageJson = require('./utils/update-project/package-json-update')(
        dest.tars.fullPath,
      );

      if (
        JSON.stringify(newPackageJson) !==
        JSON.stringify(require(packageJsonPath))
      ) {
        isNeededToReinstallPackages = true;
        fs.writeFileSync(
          packageJsonPath,
          JSON.stringify(newPackageJson, null, 2),
        );
        tarsSay('package.json has been updated.');
      }
      /**
       * END package.json update
       */

      /**
       * START update component-scheme
       */
      if (semver.cmp(currentTarsVersion, '<', '1.8.0')) {
        fsExtra.copySync(
          `${dest.templater.fullPath}/markup/components/default_component_scheme.json`,
          `${cwd}/markup/${componentsFolderName}/default_component_scheme.json`,
        );
      }
      /**
       * END update component-scheme
       */

      tarsSay('All config-files have been updated.');
      resolve();
    });
  }

  /**
   * Update system tasks, helpers and main tars.js
   * @return {Promise}
   */
  private updateTasksAndHelpers() {
    return new Promise(resolve => {
      const currentTasksPath = `${cwd}/tars/tasks`;
      const currentWatchersPath = `${cwd}/tars/watchers`;
      const currentHelpersPath = `${cwd}/tars/helpers`;
      const currentTarsJsPath = `${cwd}/tars/tars.js`;
      const pathsToDel = [
        currentTasksPath,
        currentWatchersPath,
        currentHelpersPath,
        currentTarsJsPath,
      ];

      del.sync(pathsToDel);

      try {
        fsExtra.copySync(`${dest.tars.fullPath}/tars/tasks`, currentTasksPath);
        fsExtra.copySync(
          `${dest.tars.fullPath}/tars/watchers`,
          currentWatchersPath,
        );
        fsExtra.copySync(
          `${dest.tars.fullPath}/tars/helpers`,
          currentHelpersPath,
        );
        fsExtra.copySync(
          `${dest.tars.fullPath}/tars/tars.js`,
          currentTarsJsPath,
        );
        fsExtra.copySync(
          `${dest.tars.fullPath}/tars/user-tasks/example-task.js`,
          `${cwd}/tars/user-tasks/example-task.js`,
        );
        fsExtra.copySync(
          `${dest.tars.fullPath}/tars/user-watchers/example-watcher.js`,
          `${cwd}/tars/user-watchers/example-watcher.js`,
        );

        if (semver.cmp(currentTarsVersion, '<', '1.6.0')) {
          fsExtra.copySync(
            `${dest.tars.fullPath}/tars/user-tasks/html`,
            `${cwd}/tars/user-tasks/html`,
          );
        }

        if (semver.cmp(currentTarsVersion, '<', '1.9.0')) {
          fsExtra.copySync(
            `${dest.tars.fullPath}/tars/user-tasks/html/helpers/pug-helpers.js`,
            `${cwd}/tars/user-tasks/html/helpers/pug-helpers.js`,
          );
        }
      } catch (copyError) {
        throw new Error(copyError);
      }

      tarsSay('Tasks, watchers, helpers and tars.js have been updated.');
      resolve();
    });
  }

  /**
   * Update some css-files
   * @return {Promise}
   */
  private updatesForCss() {
    return new Promise(resolve => {
      // @ts-ignore
      if (!commandOptions.excludeCss) {
        fsExtra.copySync(
          // @ts-ignore
          `${dest.css.fullPath}/markup/static/${currentTarsConfig.cssPreprocessor}/sprite-generator-templates`,
          // @ts-ignore
          `${cwd}/markup/${currentTarsConfig.fs.staticFolderName}/${currentTarsConfig.cssPreprocessor}/sprite-generator-templates`,
          { clobber: true },
        );

        if (semver.cmp(currentTarsVersion, '<', '1.8.0')) {
          fsExtra.copySync(
            // @ts-ignore
            `${dest.css.fullPath}/markup/static/${currentTarsConfig.cssPreprocessor}/entry`,
            // @ts-ignore
            `${cwd}/markup/${currentTarsConfig.fs.staticFolderName}/${currentTarsConfig.cssPreprocessor}/entry`,
          );
        }

        tarsSay('Style-files have been updated.');
        resolve();
      } else {
        resolve();
      }
    });
  }

  /**
   * Update some templater-files
   * @return {Promise}
   */
  private updatesForHtml() {
    return new Promise(resolve => {
      // @ts-ignore
      if (!commandOptions.excludeHtml) {
        fsExtra.copy(
          `${dest.templater.fullPath}/markup/pages/_template.${templaterExtension}`,
          `${cwd}/markup/pages/_template.${templaterExtension}`,
          // @ts-ignore
          error => {
            if (error) {
              throw new Error(error);
            }

            tarsSay('Templater-files have been updated.');
            resolve();
          },
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
  private updatesForJs() {
    return new Promise(resolve => {
      try {
        fsExtra.copySync(
          `${dest.tars.fullPath}/markup/static/js/separate-js`,
          // @ts-ignore
          `${cwd}/markup/${currentTarsConfig.fs.staticFolderName}/js/separate-js`,
        );

        if (semver.cmp(downloadedVersion, '>=', '1.7.0')) {
          try {
            fs.statSync(
              // @ts-ignore
              `${cwd}/markup/${currentTarsConfig.fs.staticFolderName}/js/main.js`,
            );
          } catch (error) {
            fsExtra.copySync(
              `${dest.tars.fullPath}/markup/static/js/main.js`,
              // @ts-ignore
              `${cwd}/markup/${currentTarsConfig.fs.staticFolderName}/js/main.js`,
            );
          }
        }
      } catch (error) {
        throw new Error(error);
      }

      tarsSay('JS-files have been updated.');
      resolve();
    });
  }

  /**
   * Update gulpfule.js
   * @return {Promise}
   */
  private gulpfileUpdate() {
    return new Promise(resolve => {
      fsExtra.copy(
        `${dest.tars.fullPath}/gulpfile.js`,
        `${cwd}/gulpfile.js`,
        (error: any) => {
          if (error) {
            throw new Error(error);
          }

          tarsSay('Gulpfile has been updated.');
          resolve();
        },
      );
    });
  }

  /**
   * Update documentation
   * @return {Promise}
   */
  private updateDocs() {
    return new Promise(resolve => {
      const currentDocsPath = `${cwd}/docs`;
      const currentReadmeRu = `${cwd}/README_RU.md`;
      const currentReadme = `${cwd}/README.md`;
      const pathsToDel = [currentDocsPath, currentReadmeRu, currentReadme];

      del.sync(pathsToDel);

      try {
        fsExtra.copySync(`${dest.tars.fullPath}/docs`, currentDocsPath);
        fsExtra.copySync(`${dest.tars.fullPath}/README_RU.md`, currentReadmeRu);
        fsExtra.copySync(`${dest.tars.fullPath}/README.md`, currentReadme);
      } catch (copyError) {
        throw new Error(copyError);
      }

      tarsSay('Documentation has been updated.');
      resolve();
    });
  }

  /**
   * Install packages, if it is needed
   * @return {Promise}
   */
  private installPackages() {
    return new Promise(resolve => {
      if (isNeededToReinstallPackages) {
        exec('npm i', (error: any) => {
          if (error) {
            throw new Error(error);
          } else {
            tarsSay('NPM-packages have been updated.');
            resolve();
          }
        });
      } else {
        tarsSay('NPM-packages were not changed.');
        resolve();
      }
    });
  }

  /**
   * Update webpack.config.js
   * @return {Promise}
   */
  private updateWebpackConfig() {
    return new Promise(resolve => {
      if (semver.cmp(currentTarsVersion, '<', '1.7.0')) {
        return resolve();
      }

      fsExtra.copySync(
        `${cwd}/webpack.config.js`,
        `${cwd}/${currentTarsVersion}-webpack.config.js`,
        { clobber: true },
      );
      fsExtra.copySync(
        `${dest.tars.fullPath}/webpack.config.js`,
        `${cwd}/webpack.config.js`,
        { clobber: true },
      );
      tarsSay('Webpack.config has been updated.');
      return resolve();
    });
  }

  /**
   * Start custom actions from custom-update-actions.json
   * @return {Promise}
   */
  private customActions() {
    return new Promise(resolve => {
      let customActionsConfig;

      try {
        customActionsConfig = require(`${dest.tars.fullPath}/custom-update-actions.json`);
      } catch (error) {
        tarsSay(chalk.yellow(error.message));
        tarsSay(chalk.yellow('Will continue without custom-update-actions'));
        return resolve();
      }

      if (customActionsConfig.remove && customActionsConfig.remove.length) {
        customActionsConfig.remove.forEach((itemToRemove: any) => {
          del.sync(`${cwd}/${itemToRemove}`);
        });
      }

      if (customActionsConfig.copy && customActionsConfig.copy.length) {
        customActionsConfig.copy.forEach((itemToCopy: any) => {
          try {
            fsExtra.copySync(
              `${dest.tars.fullPath}${itemToCopy.from}`,
              `${cwd}${itemToCopy.to}`,
            );
          } catch (copyError) {
            tarsSay(
              chalk.yellow('Error while coping files from custom-actions'),
            );
            tarsSay(chalk.yellow(copyError.message));
          }
        });
      }

      if (customActionsConfig.rename && customActionsConfig.rename.length) {
        customActionsConfig.rename.forEach((itemToRename: any) => {
          try {
            fs.renameSync(
              `${cwd}${itemToRename.from}`,
              `${cwd}${itemToRename.to}`,
            );
          } catch (renameError) {
            tarsSay(
              chalk.yellow('Error while renaming files from custom-actions'),
            );
            tarsSay(chalk.yellow(renameError.message));
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
  private removeUselessFiles(isLogsMuted: any) {
    return new Promise(resolve => {
      const pathsToDel = [
        dest.tars.root,
        dest.css.root,
        dest.templater.root,
        `${cwd}/.jscsrc`,
      ];

      del.sync(pathsToDel);

      if (!isLogsMuted) {
        tarsSay('Useless files have been removed.');
      }

      resolve();
    });
  }

  /**
   * Final log
   */
  private finalActions() {
    console.log('\n');
    tarsSay(chalk.green('Your project has been updated successfully!'));
    tarsSay(`Current version is: ${chalk.cyan.bold(downloadedVersion)}`);
    tarsSay(
      chalk.yellow(
        'Do not forget to check gulpfile.js, system task and watchers if you have changed it.',
      ),
    );
    tarsSay(chalk.yellow('Do not forget to check webpack.config.js!'));
    tarsSay(chalk.yellow('I can not merge it automatically('));
    tarsSay(
      chalk.yellow(
        'So, I have created a copy of your previous webpack.config.js.',
      ),
    );
    tarsSay(chalk.yellow('Please, merge it manually.'));
    tarsSay(
      chalk.yellow('You can remove old webpack.config.js after merging.'),
    );
    tarsSay(
      `Dir with backup of your project: "${chalk.cyan(backupFolderName)}"`,
    );
    tarsSay('Have a nice work =).', true);
  }

  /**
   * Start actions, if something is gone wrong
   * @param  {Object} error Object with info about error
   */
  private actionsOnError(error: any) {
    console.log('\n');
    del.sync([`${currentTarsVersion}-webpack.config.js`]);
    this.removeUselessFiles(true);
    tarsSay(chalk.red('Something is gone wrong...'));
    tarsSay(
      `Dir with backup of your project: "${chalk.cyan(backupFolderName)}"`,
    );
    tarsSay(
      'Please, repost the message and the stack trace of Error to developer tars.builder@gmail.com',
      true,
    );
    console.error(error.stack);
  }

  /**
   * Just start update process
   */
  private startUpdateProcess() {
    Promise.all([this.downloadNewPreprocessor(), this.downloadNewTemplater()])
      .then(() => {
        return new Promise(resolve => {
          tarsSay('New version has been downloaded successfully.');
          tarsSay(
            "I'll wait for 5 seconds to be sure, that all new files on your disk already.",
          );

          setTimeout(() => {
            resolve();
          }, 5000);
        });
      })
      .then(this.makeBackup)
      .then(this.updateConfigFiles)
      .then(this.updateTasksAndHelpers)
      .then(this.updatesForCss)
      .then(this.updatesForJs)
      .then(this.updatesForHtml)
      .then(this.gulpfileUpdate)
      .then(this.updateDocs)
      .then(this.installPackages)
      .then(this.updateWebpackConfig)
      .then(this.customActions)
      .then(this.removeUselessFiles)
      .then(this.finalActions)
      .catch(this.actionsOnError);
  }
}
