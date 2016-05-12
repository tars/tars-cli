'use strict';

const fs = require('fs');

const tarsUtils = require('../../utils');
const cwd = process.cwd();

module.exports = function updatesDuringBuildProcess() {
    require('./update-project/update-babelrc')();

    const eslintrcPath = cwd + '/.eslintrc';
    const tarsConfig = tarsUtils.getTarsConfig();
    let currentEslintConfigContent;
    let newEslintConfig;

    try {
        currentEslintConfigContent = fs.readFileSync(eslintrcPath);
    } catch (error) {
        currentEslintConfigContent = null;
    }

    if (tarsConfig.useJsLintAndHint || (tarsConfig.js && tarsConfig.js.lint)) {
        if (!currentEslintConfigContent) {
            throw new Error('.eslintrc is not found! Please, add config for ESLint!');
        } else {

            const currentEslintConfig = JSON.parse(
                currentEslintConfigContent.toString().replace(/\/\/[\s\w]+/gi, '')
            );

            if (!currentEslintConfig.parserOptions) {
                newEslintConfig = require('./update-project/eslintrc-update')(currentEslintConfig);
                fs.writeFileSync(eslintrcPath, JSON.stringify(newEslintConfig, null, 2));
            }
        }
    }
};
