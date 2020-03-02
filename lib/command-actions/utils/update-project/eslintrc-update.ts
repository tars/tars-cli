'use strict';

module.exports = function updateEslintrc(currentEslintConfig) {

    let newEslintConfig;

    newEslintConfig = JSON.parse(JSON.stringify(currentEslintConfig));

    newEslintConfig.env = Object.assign(
        currentEslintConfig.env,
        {
            commonjs: currentEslintConfig.env.commonjs || true
        }
    );

    if (!newEslintConfig.parserOptions) {
        newEslintConfig.parserOptions = {
            ecmaVersion: 6,
            sourceType: 'module'
        };
    }

    newEslintConfig.rules = Object.assign(
        newEslintConfig.rules,
        {
            'consistent-return': 0,
            'keyword-spacing': 2,
            strict: 0,
            'no-confusing-arrow': 2,
            'prefer-arrow-callback': 0,
            'no-debugger': 0,

            /* eslint-disable no-undefined */

            'no-arrow-condition': undefined,
            'space-return-throw-case': undefined,
            'space-after-keywords': undefined,
            'no-empty-label': undefined,
            'no-process-exit': undefined

            /* eslint-enable no-undefined */
        }
    );

    return newEslintConfig;
};
