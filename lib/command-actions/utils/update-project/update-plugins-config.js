'use strict';

const commentJson = require('comment-json');

module.exports = function updatePluginsConfig(downloadedPluginsConfigString, tarsConfig) {
    const browserSyncConfig = tarsConfig.browserSyncConfig;

    if (!browserSyncConfig && !tarsConfig.autoprefixerConfig) {
        return downloadedPluginsConfigString;
    }

    const parsedPluginsConfig = Object.assign(
        {},
        commentJson.parse(downloadedPluginsConfigString),
        {
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
            }
        },
        {
            autoprefixerConfig: tarsConfig.autoprefixerConfig
        }
    );

    return commentJson.stringify(parsedPluginsConfig, null, 4);
};


