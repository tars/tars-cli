'use strict';

/**
 * Set templates extension
 * @return {string} Templater extension
 */
module.exports = function getTemplaterExtension(templater) {
    switch (templater) {
        case 'handelbars':
        case 'handlebars':
        case 'hdb':
        case 'hb':
            return 'html';
        case 'jade':
            return 'jade';
        case 'pug':
        default:
            return 'pug';
    }
};
