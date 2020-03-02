'use strict';

const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const tarsUtils = require('../../../utils');
const execSync = require('child_process').execSync;
const babelConfigPath = `${process.cwd()}/.babelrc`;
const currentTarsConfig = tarsUtils.getTarsConfig();
const projectPackageJson = require(`${process.cwd()}/package.json`);
const semver = require('semver');


module.exports = function updateBabelConfig() {
    let babelConfig;
    let newBabelConfig = {
        presets: ['@babel/preset-env'],
        ignore: [
            '**/babel_ignore_*.js',
            '*/js/framework/*.js',
            '*/js/libraries/*.js',
            '*/js/plugins/*.js',
            '*/js/separate-js/*.js'
        ]
    };
    const staticJsFilesPatterns = [
        '*/js/framework/*.js',
        '*/js/libraries/*.js',
        '*/js/plugins/*.js',
        '*/js/separate-js/*.js'
    ];
    const useBabel = currentTarsConfig.useBabel || (currentTarsConfig.js && currentTarsConfig.js.useBabel);

    if (!useBabel) {
        return false;
    }

    try {
        babelConfig = fsExtra.readJsonSync(babelConfigPath);
    } catch (error) {
        babelConfig = false;
    }

    if (babelConfig) {
        if (semver.cmp(tarsUtils.getTarsProjectVersion(), '<', '1.6.0') && !babelConfig.presets) {
            newBabelConfig.ignore = babelConfig.ignore;
            fs.writeFileSync(babelConfigPath, JSON.stringify(newBabelConfig, null, 2));
        }

        // Remove static/**/*.js from ignore and add all pathes from staticJsFilesPatterns
        if (semver.cmp(tarsUtils.getTarsProjectVersion(), '>=', '1.5.0') && babelConfig.ignore &&
            babelConfig.ignore.length && babelConfig.ignore.indexOf('static/**/*.js') !== -1) {

            newBabelConfig.presets = babelConfig.presets;
            newBabelConfig.ignore = staticJsFilesPatterns.concat(
                babelConfig.ignore.slice(0, babelConfig.ignore.indexOf('static/**/*.js')),
                babelConfig.ignore.slice(babelConfig.ignore.indexOf('static/**/*.js') + 1)
            );
            fs.writeFileSync(babelConfigPath, JSON.stringify(newBabelConfig, null, 2));
        }

        if (semver.cmp(tarsUtils.getTarsProjectVersion(), '>=', '1.10.0')) {
            babelConfig.presets = newBabelConfig.presets;
            fs.writeFileSync(babelConfigPath, JSON.stringify(babelConfig, null, 2));
        }
    } else {
        fs.writeFileSync(babelConfigPath, JSON.stringify(newBabelConfig, null, 2));
    }

    if (projectPackageJson.dependencies && !projectPackageJson.dependencies['@babel/preset-env']) {
        tarsUtils.tarsSay('Please, wait for a moment, while I\'m update Babel to 7 version...');
        tarsUtils.tarsSay('It can take more than 1 minute.');
        if (projectPackageJson.dependencies['babel-preset-es2015']) {
            execSync('npm r -S babel-preset-es2015');
        }
        execSync('npm r -S babel-core');
        execSync('npm i @babel/core --save');
        execSync('npm i @babel/preset-env --save');
        tarsUtils.tarsSay('Babel has been updated successfully!', true);
    }
};
