'use strict';

const commentJson = require('comment-json');

module.exports = function updatePluginsConfig(downloadedPluginsConfigString, tarsConfig, currentTarsVersion) {
    let parsedPluginsConfig = {};
    const parsedDownloadedPluginsConfig = commentJson.parse(downloadedPluginsConfigString);
    const browserSyncConfig = tarsConfig.browserSyncConfig;

    if (currentTarsVersion < '1.8.0' && browserSyncConfig && tarsConfig.autoprefixerConfig) {
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
    }

    if (currentTarsVersion < '1.9.0') {
        parsedPluginsConfig = Object.assign(
            parsedPluginsConfig,
            {
                'gulp-pug': parsedDownloadedPluginsConfig['gulp-jade'],
                'gulp-htmlmin': parsedDownloadedPluginsConfig['gulp-htmlmin'],
                'gulp-minify-html': undefined // eslint-disable-line no-undefined
            }
        );
    }

    parsedPluginsConfig = Object.assign(
        commentJson.parse(downloadedPluginsConfigString),
        parsedPluginsConfig
    );

    return commentJson.stringify(parsedPluginsConfig, null, 4);
};


