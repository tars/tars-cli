'use strict';

const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const tarsUtils = require('../../utils');
const babelConfigPath = `${process.cwd()}/.babelrc`;

module.exports = function updateBabelConfig() {
    const babelConfig = fsExtra.readJsonSync(babelConfigPath);

    if (tarsUtils.getTarsProjectVersion() < '1.6.0' && !babelConfig.presets) {
        const newBabelConfig = {
            ignore: babelConfig.ignore,
            presets: ["es2015"]
        };

        fs.writeFileSync(babelConfigPath, JSON.stringify(newBabelConfig, null, 2));
    }
};
