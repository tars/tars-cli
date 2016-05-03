'use strict';

const fs = require('fs');
const configPromtOptions = require('../constants').CONFIG;

/**
 * Save answers from promt to local tars-config
 * @param  {Object} answers Answers from fs-promts
 */
module.exports = function saveConfigAnswers(answers) {
    const cwd = process.cwd();
    const originalConfig = require(`${cwd}/tars-config.js`);
    let newConfig = Object.assign({}, originalConfig);

    // Set useNotify option
    newConfig.notifyConfig.useNotify = answers.useNotify;

    newConfig = Object.assign(newConfig, {
        templater: answers.templater.toLowerCase() || originalConfig.templater,
        cssPreprocessor: answers.preprocessor.toLowerCase() || originalConfig.cssPreprocessor,
        staticPrefix: `${answers.staticFolderName}/`,
        useImagesForDisplayWithDpi: answers.useImagesForDisplayWithDpi,
        fs: {
            staticFolderName: answers.staticFolderName,
            imagesFolderName: answers.imagesFolderName,
            componentsFolderName: answers.componentsFolderName
        }
    });

    newConfig.js = Object.assign(
        newConfig.js,
        {
            workflow: configPromtOptions.js.wokflow[answers.jsWorkflow],
            useBabel: answers.useBabel,
            lint: answers.useLint
        }
    );

    const newConfigFileContent = `module.exports = ${JSON.stringify(newConfig, null, 4)};`;

    fs.writeFileSync(`${cwd}/tars-config.js`, newConfigFileContent);
};
