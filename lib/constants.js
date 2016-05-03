'use strict';

const GENERAL_BUILD_OPTIONS = {
    'ie9': {
        flag: '--ie9',
        title: ' IE9 maintenance'
    },
    'ie8': {
        flag: '--ie8',
        title: ' IE8 maintenance'
    },
    'ie': {
        flag: '--ie',
        title: ' IE8 and IE9 maintenance'
    },
    'customFlags': {
        flag: '--customFlags',
        title: ' Custom flags'
    }
};

/**
 * Constats for build promt and processing
 * @type {Object}
 */
const BUILD = Object.assign(
    {},
    {
        'release': {
            flag: '--release',
            title: ' Release mode'
        },
        'min': {
            flag: '--min',
            title: ' Minify files only'
        }
    },
    GENERAL_BUILD_OPTIONS
);

const DEV = Object.assign(
    {},
    {
        'livereload': {
            flag: '--lr',
            title: ' Start server for livereload'
        },
        'tunnel': {
            flag: '--tunnel',
            title: ' Start server for tunnel and livereload'
        }
    },
    GENERAL_BUILD_OPTIONS
);

const ADD_COMPONENT = {
    'basic': ' Basic files (js, html and stylies)',
    'assets': ' Assets dir',
    'data': ' Data dir',
    'ie': ' IE dir',
    'full': ' Full pack (all available folders and files)',
    'template': ' Make a copy of _template',
    'empty': ' Just empty dir, without files'
};

const CONFIG = {
    js: {
        workflow: {
            'concat': 'Concat (Just concatenation of JavaScript-files into one bundle)',
            'modular': 'Modular (Webpack will be used to resolve requires/imports between JavaScript-files)'
        }
    }
};

module.exports = {
    BUILD,
    DEV,
    ADD_COMPONENT,
    GENERAL_BUILD_OPTIONS,
    CONFIG
};
