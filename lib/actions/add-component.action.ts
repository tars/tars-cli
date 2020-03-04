import { AbstractAction } from './abstract.action';
const fs = require('fs');
const fsExtra = require('fs-extra');
const mkdirp = require('mkdirp');
import chalk from 'chalk';
const del = require('del');
const addComponentPromt = require('../promt/add-component-promt');
import {
  tarsSay,
  getTarsConfig,
  getTarsProjectVersion,
  getUsedFlags,
  validateFolderName,
} from '../utils';
const currentTarsVersion = getTarsProjectVersion();
import { ADD_COMPONENT as addComponentdPromtOptions } from '../constants';
const cwd = process.cwd();
const tarsConfig = getTarsConfig();
const getTemplaterExtension = require('./utils/get-templater-extension');
const templater = tarsConfig.templater.toLowerCase();
const cssPreprocessor = tarsConfig.cssPreprocessor.toLowerCase();
// modules — fallback for old version of tars
const componentsFolderName = tarsConfig.fs.componentsFolderName || 'modules';
const semver = require('semver');

const extensions = {
  tpl: getTemplaterExtension(templater),
  css: cssPreprocessor === 'stylus' ? 'styl' : cssPreprocessor,
};
// @ts-ignore
let newComponentName;

/**
 * Create component in markup directory
 * @param  {String} componentName The name of new component
 * @param  {Object} options       Inquirer options
 */
export class AddComponentAction extends AbstractAction {
  public async handle(componentName: any, options: any) {
    console.log('\n');

    const validateResult = validateFolderName(componentName);

    // If componentName has depricated symbols, log the error
    if (typeof validateResult === 'string') {
      tarsSay(chalk.red(validateResult + '\n'), true);
      return;
    }

    newComponentName = componentName;
    const commandOptions = Object.assign({}, options);

    if (getUsedFlags(commandOptions).length) {
      this.createComponent(commandOptions);
    } else {
      addComponentPromt(this.createComponentWithPromt);
    }
  }

  /**
   * Create component with structure based on answers from promt
   * @param  {Object} answers Answers from promt
   */
  private createComponentWithPromt(answers: any) {
    // Path to new component. Includes component name
    const newComponentPath = this.getNewComponentPath(answers.customPath);

    if (this.isComponentExist(newComponentPath)) {
      return;
    }

    // @ts-ignore
    if (answers.mode.indexOf(addComponentdPromtOptions.scheme.title) > -1) {
      this.createComponentByScheme(newComponentPath, {
        schemeFile: answers.scheme,
        customPath: answers.customPath,
      });
      return;
    }

    if (answers.mode.indexOf(addComponentdPromtOptions.template.title) > -1) {
      // @ts-ignore
      createCopyOfTemplate(newComponentPath);
      return this.successLog(answers.customPath);
    }

    mkdirp((newComponentPath: any, error: any) => {
      if (error) {
        return this.actionsOnError(error, newComponentPath);
      }

      try {
        if (answers.mode.indexOf(addComponentdPromtOptions.empty.title) > -1) {
          void 0;
        } else if (
          answers.mode.indexOf(addComponentdPromtOptions.full.title) > -1
        ) {
          this.generateBaseFiles(newComponentPath);
          this.createIEFolder(newComponentPath);
          this.createAssetsFolder(newComponentPath);
          this.createDataFolder(newComponentPath);
        } else {
          answers.mode.forEach((mode: any) => {
            console.log(mode);
            switch (mode) {
              case addComponentdPromtOptions.assets.title:
                this.createAssetsFolder(newComponentPath);
                break;
              case addComponentdPromtOptions.ie.title:
                this.createIEFolder(newComponentPath);
                break;
              case addComponentdPromtOptions.data.title:
                this.createDataFolder(newComponentPath);
                break;
              case addComponentdPromtOptions.basic.title:
              default:
                this.generateBaseFiles(newComponentPath);
                break;
            }
          });
        }
      } catch (generationError) {
        return this.actionsOnError(generationError, newComponentPath);
      }

      return this.successLog(answers.customPath);
    });
  }

  /**
   * Create component with structure based on command options
   * @param {Object} commandOptions Options, which is passed from CLI
   */
  private createComponent(commandOptions: any) {
    // Path to new component. Includes component name
    const newComponentPath = this.getNewComponentPath(commandOptions.customPath);

    if (this.isComponentExist(newComponentPath)) {
      return;
    }

    if (
      commandOptions.scheme &&
      semver.cmp(currentTarsVersion, '>=', '1.8.0')
    ) {
      if (commandOptions.scheme && typeof commandOptions.scheme === 'boolean') {
        commandOptions.scheme = '';
      }

      this.createComponentByScheme(newComponentPath, {
        schemeFile: commandOptions.scheme || 'default_component_scheme.json',
        customPath: commandOptions.customPath,
      });
      return;
    }

    if (commandOptions.template) {
      this.createCopyOfTemplate(newComponentPath, commandOptions.customPath);
      return;
    }

    mkdirp((newComponentPath: any, error: any) => {
      if (error) {
        return this.actionsOnError(error, newComponentPath);
      }

      let generateStructure = true;

      try {
        if (commandOptions.empty) {
          generateStructure = false;
        }

        if (commandOptions.full && generateStructure) {
          this.generateBaseFiles(newComponentPath);
          this.createIEFolder(newComponentPath);
          this.createAssetsFolder(newComponentPath);
          this.createDataFolder(newComponentPath);
          generateStructure = false;
        }

        if (commandOptions.basic && generateStructure) {
          this.generateBaseFiles(newComponentPath);
        }

        if (commandOptions.assets && generateStructure) {
          this.createAssetsFolder(newComponentPath);
        }

        if (commandOptions.data && generateStructure) {
          this.createDataFolder(newComponentPath);
        }

        if (commandOptions.ie && generateStructure) {
          this.createIEFolder(newComponentPath);
        }
      } catch (generationError) {
        return this.actionsOnError(generationError, newComponentPath);
      }

      this.successLog(commandOptions.customPath);
    });
  }

  private createComponentByScheme(newComponentPath: any, params: any) {
    params = params || {};

    function parseScheme(schemeConfig: any) {
      return new Promise(resolve => {
        const stringifiedConfig = JSON.stringify(schemeConfig);
        const processedConfig = stringifiedConfig
          // @ts-ignore
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

        fsExtra.readJson(schemeFilePath, (error: any, schemeConfig: any) => {
          if (error) {
            return reject(error);
          }

          resolve(schemeConfig);
        });
      });
    }

    function writeFiles(path: any, files: any) {
      // @ts-ignore
      files.map(file => {
        try {
          fs.writeFileSync(`${path}/${file.name}`, file.content);
        } catch (error) {
          throw new Error(error);
        }
      });
    }

    function processFolders(path: any, folders: any) {
      folders.map((folder: any) => {
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

    function generateComponent(scheme: any) {
      return new Promise((resolve, reject) => {
        const initialFolders = scheme.folders;
        const initialFiles = scheme.files;

        mkdirp((newComponentPath: any, error: any) => {
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
        this.successLog(params.customPath);
      })
      .catch(error => {
        this.actionsOnError(error, newComponentPath);
      });
  }

  private createCopyOfTemplate(newComponentPath: any, customPath: any) {
    // @ts-ignore
    fsExtra.copy(
      `${cwd}/markup/${componentsFolderName}/_template`,
      newComponentPath,
      // @ts-ignore
      error => {
        if (error) {
          tarsSay(
            chalk.red(
              `_template component does not exist in the "markup/${componentsFolderName}" directory.`,
            ),
          );
          tarsSay('This folder is used as template for new component.');
          tarsSay(
            `Create template or run the command
                ${chalk.cyan('"tars add-component <componentName>"')}
                to create component with another options.\n`,
            true,
          );
        } else {
          this.successLog(customPath);
        }
      },
    );
  }

  private successLog(customPath: any) {
    let newComponentPath = `markup/${componentsFolderName}`;

    if (customPath) {
      newComponentPath += `/${customPath}`;
    }

    // @ts-ignore
    tarsSay(
      chalk.green(
        // @ts-ignore
        `Component "${newComponentName}" has been added to ${newComponentPath}.\n`,
      ),
      true,
    );
  }

  /**
   * Create folder for data
   * @param {String} newComponentPath Path to new component
   */
  private createDataFolder(newComponentPath: any) {
    // @ts-ignore
    let processedComponentName = newComponentName;
    let dataFileContent = '';

    if (processedComponentName.indexOf('-') > -1) {
      processedComponentName = "'" + processedComponentName + "'";
    }

    if (semver.cmp(getTarsProjectVersion(), '>=', '1.6.0')) {
      dataFileContent = `var data = {${processedComponentName}: {}};`;
    } else {
      dataFileContent = `${processedComponentName}: {}`;
    }

    fs.mkdirSync(newComponentPath + '/data');
    fs.appendFileSync(newComponentPath + '/data/data.js', '\n');

    fs.writeFileSync(newComponentPath + '/data/data.js', dataFileContent);
  }

  /**
   * Create folder for IE's stylies
   * @param {String} newComponentPath Path to new component
   */
  private createIEFolder(newComponentPath: any) {
    fs.mkdirSync(newComponentPath + '/ie');
  }

  /**
   * Create folder for assets
   * @param {String} newComponentPath Path to new component
   */
  private createAssetsFolder(newComponentPath: any) {
    fs.mkdirSync(newComponentPath + '/assets');
  }

  private actionsOnError(error: any, newComponentPath: any) {
    console.log('\n');
    del.sync(newComponentPath);
    tarsSay(chalk.red('Something is gone wrong...'));
    tarsSay(
      'Please, repost the message and the stack trace of Error to developer tars.builder@gmail.com',
      true,
    );
    console.error(error.stack);
  }

  private getNewComponentPath(customPath: any) {
    let newComponentPath = `${cwd}/markup/${componentsFolderName}/`;

    // Path to new component. Includes component name
    if (customPath && semver.cmp(currentTarsVersion, '>=', '1.8.0')) {
      // @ts-ignore
      newComponentPath += `${customPath}/${newComponentName}`;
    } else {
      // @ts-ignore
      newComponentPath += newComponentName;
    }

    return newComponentPath;
  }

  private isComponentExist(newComponentPath: any) {
    // Create new component if component with newComponentName is not existed already
    try {
      fs.statSync(newComponentPath);
    } catch (error) {
      return false;
    }

    tarsSay(
      chalk.red(`Component "${newComponentPath}" already exists.\n`),
      true,
    );
    return true;
  }

  /**
   * Generate base files for component. Js, Html and Css file
   * @param {String} newComponentPath Path to new component
   */
  private generateBaseFiles(newComponentPath: any) {
    // @ts-ignore
    const newComponentFolder = `${newComponentPath}/${newComponentName}`;

    fs.appendFileSync(`${newComponentFolder}.${extensions.css}`, '\n');
    fs.appendFileSync(`${newComponentFolder}.js`, '\n');
    fs.appendFileSync(`${newComponentFolder}.${extensions.tpl}`, '\n');

    if (extensions.tpl === 'jade' || extensions.tpl === 'pug') {
      fs.writeFileSync(
        `${newComponentFolder}.${extensions.tpl}`,
        // @ts-ignore
        `mixin ${newComponentName}(data)\n    .${newComponentName}`,
      );
    }
  }
}
