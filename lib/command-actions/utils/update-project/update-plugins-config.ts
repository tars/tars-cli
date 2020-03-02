"use strict";

const commentJson = require("comment-json");
const semver = require("semver");

module.exports = function updatePluginsConfig(
    downloadedPluginsConfigString,
    currentPluginsConfigString,
    tarsConfig,
    currentTarsVersion
) {
    let parsedPluginsConfig = {};
    const parsedDownloadedPluginsConfig = commentJson.parse(
        downloadedPluginsConfigString
    );
    const browserSyncConfig = tarsConfig.browserSyncConfig;

    if (
        semver.cmp(currentTarsVersion, "<", "1.8.0") &&
        browserSyncConfig &&
        tarsConfig.autoprefixerConfig
    ) {
        parsedPluginsConfig = {
            browserSync: {
                server: {
                    baseDir: browserSyncConfig.baseDir
                },
                port: browserSyncConfig.port,
                open: browserSyncConfig.open,
                browser: browserSyncConfig.browser,
                startPath: browserSyncConfig.startUrl,
                notify: browserSyncConfig.useNotifyInBrowser,
                injectChanges: browserSyncConfig.injectChanges
            },
            autoprefixerConfig: tarsConfig.autoprefixerConfig,
            browserSyncConfig: undefined // eslint-disable-line no-undefined
        };
    } else {
        parsedPluginsConfig = commentJson.parse(currentPluginsConfigString);
    }

    if (semver.cmp(currentTarsVersion, "<", "1.9.0")) {
        parsedPluginsConfig["gulp-minify-html"] = undefined; // eslint-disable-line no-undefined
    }

    if (semver.cmp(currentTarsVersion, ">", "1.11.7")) {
        if (parsedPluginsConfig.autoprefixerConfig) {
            delete parsedPluginsConfig.autoprefixerConfig;
        }
    }

    if (semver.cmp(currentTarsVersion, "<", "1.14.0")) {
        parsedPluginsConfig = Object.assign(
            {
                ["gulp-terser"]: parsedPluginsConfig["gulp-uglify"],
                "gulp-uglify": null
            },
            parsedPluginsConfig
        );
    }

    return commentJson.stringify(parsedPluginsConfig, null, 4);
};
