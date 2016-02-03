'use strict';

const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const tarsUtils = require('../../utils');
const execSync = require('child_process').execSync;
const babelConfigPath = `${process.cwd()}/.babelrc`;

module.exports = function updateBabelConfig() {
    const babelConfig = fsExtra.readJsonSync(babelConfigPath);

    if (tarsUtils.getTarsProjectVersion() < '1.6.0' && !babelConfig.presets) {
        const newBabelConfig = {
            ignore: babelConfig.ignore,
            presets: ["es2015"]
        };

        tarsUtils.tarsSay('Please, wait for a moment, while I\'m installing new packages...');
        tarsUtils.tarsSay('It is needed to work correctly with new version of TARS-CLI.', true);
        execSync('npm i babel-preset-es2015 --save');

        fs.writeFileSync(babelConfigPath, JSON.stringify(newBabelConfig, null, 2));
    }
};
