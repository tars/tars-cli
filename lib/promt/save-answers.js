'use strict';

const fs = require('fs');

/**
 * Save answers from promt to local tars-config
 * @param  {Object} answers Answers from fs-promts
 */
module.exports = function saveAnswers(answers) {
    const cwd = process.cwd();
    const originalConfig = require(cwd + '/tars-config.js');
    let newConfig = Object.assign({}, originalConfig);

    // Set useNotify option
    newConfig.notifyConfig.useNotify = answers.useNotify;


    newConfig = Object.assign(newConfig, {
        templater: answers.templater || originalConfig.templater,
        cssPreprocessor: answers.preprocessor || originalConfig.cssPreprocessor,
        useBabel: answers.useBabel,
        staticPrefix: answers.staticFolderName + '/',
        useImagesForDisplayWithDpi: answers.useImagesForDisplayWithDpi,
        fs: {
            staticFolderName: answers.staticFolderName,
            imagesFolderName: answers.imagesFolderName
        }
    });

    const newConfigFileContent = `module.exports = ${JSON.stringify(newConfig, null, 4)};`;

    fs.writeFileSync(cwd + '/tars-config.js', newConfigFileContent);
};
