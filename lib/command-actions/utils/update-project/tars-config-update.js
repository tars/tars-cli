'use strict';
const semver = require('semver');

module.exports = function updateTarsConfig(params) {
    const svgConfig = params.currentTarsConfig.svg;
    const jsConfig = params.currentTarsConfig.js;
    const cssConfig = params.currentTarsConfig.css;

    let newTarsConfig = Object.assign(
        {},
        params.currentTarsConfig,
        {
            /* eslint-disable no-undefined */

            staticPrefixForCss: undefined,
            useSVG: undefined,

            /* eslint-enable no-undefined */

            svg: svgConfig || {
                active: params.currentTarsConfig.useSVG,
                workflow: 'sprite',
                symbolsConfig: {
                    loadingType: 'inject',
                    usePolyfillForExternalSymbols: true,
                    pathToExternalSymbolsFile: ''
                }
            }
        }
    );

    if (semver.cmp(params.downloadedVersion, '>=', '1.7.0') && !jsConfig) {
        newTarsConfig = Object.assign(
            {},
            newTarsConfig,
            {
                js: {
                    workflow: 'concat',
                    bundler: 'webpack',
                    lint: newTarsConfig.useJsLintAndHint,
                    useBabel: newTarsConfig.useBabel,
                    removeConsoleLog: newTarsConfig.removeConsoleLog,
                    webpack: {
                        useHMR: false
                    },
                    jsPathsToConcatBeforeModulesJs: newTarsConfig.jsPathsToConcatBeforeModulesJs,
                    lintJsCodeBeforeModules: newTarsConfig.lintJsCodeBeforeModules,
                    jsPathsToConcatAfterModulesJs: newTarsConfig.jsPathsToConcatAfterModulesJs,
                    lintJsCodeAfterModules: newTarsConfig.lintJsCodeAfterModules
                },
                /* eslint-disable no-undefined */

                useJsLintAndHint: undefined,
                useBabel: undefined,
                removeConsoleLog: undefined,
                jsPathsToConcatBeforeModulesJs: undefined,
                lintJsCodeBeforeModules: undefined,
                jsPathsToConcatAfterModulesJs: undefined,
                lintJsCodeAfterModules: undefined

                /* eslint-enable no-undefined */
            }
        );
    }

    if (semver.cmp(params.downloadedVersion, '>=', '1.8.0') && !cssConfig) {
        newTarsConfig = Object.assign(
            {},
            newTarsConfig,
            {
                css: {
                    workflow: 'concat'
                }
            }
        );
    }

    if (!params.currentTarsConfig.fs.componentsFolderName) {
        newTarsConfig = Object.assign(
            {},
            newTarsConfig,
            {
                fs: {
                    staticFolderName: newTarsConfig.fs.staticFolderName,
                    imagesFolderName: newTarsConfig.fs.imagesFolderName,
                    componentsFolderName: 'modules'
                }
            }
        );
    }

    if (!newTarsConfig.hasOwnProperty('generateStaticPath')) {
        newTarsConfig = Object.assign(
            {},
            newTarsConfig,
            {
                generateStaticPath: true
            }
        );
    }

    if (newTarsConfig.hasOwnProperty('staticPrefix')) {
        newTarsConfig = Object.assign(
            {},
            newTarsConfig,
            {
                staticPrefix: undefined // eslint-disable-line no-undefined
            }
        );
    }

    if (semver.cmp(params.downloadedVersion, '>=', '1.8.0') &&
        (params.currentTarsConfig.autoprefixerConfig || params.currentTarsConfig.browserSyncConfig)) {
        newTarsConfig = Object.assign(
            {},
            newTarsConfig,

            /* eslint-disable no-undefined */

            {
                autoprefixerConfig: undefined,
                browserSyncConfig: undefined
            }

            /* eslint-enable no-undefined */
        );
    }

    if (semver.cmp(params.downloadedVersion, '>=', '1.11.10') && !params.currentTarsConfig.devPath) {
        newTarsConfig = Object.assign(
            {},
            newTarsConfig,
            {
                devPath: './dev/'
            }
        );
    }

    return newTarsConfig;
};

