"use strict";

const fsExtra = require("fs-extra");
const chalk = require("chalk");

const tarsUtils = require("../../../utils");
const cwd = process.cwd();

/**
 * Merge dependencies from one package.json to another
 * @param  {Object} acceptor Object for merging
 * @param  {Object} donor    Object — provider of deps
 * @return {Object}          Processed object
 */
function mergePackageJson(acceptor, donor) {
    const keys = Object.keys(donor);

    keys.forEach(key => {
        if (!acceptor[key]) {
            acceptor[key] = {};
        }

        acceptor[key] = Object.assign(acceptor[key], donor[key]);
    });

    return acceptor;
}

module.exports = function updatePackageJson(destPath) {
    const packageJsonPath = `${cwd}/package.json`;
    let currentUserPackageJson;
    let newUserPackageJson;
    let newPackageJson = Object.assign(
        {},
        fsExtra.readJsonSync(packageJsonPath)
    );

    if (newPackageJson.dependencies.gulp) {
        newPackageJson.dependencies.gulp = "4.0.2";
    } else if (newPackageJson.devDependencies.gulp) {
        newPackageJson.devDependencies.gulp = "4.0.2";
    }

    try {
        currentUserPackageJson = require(`${cwd}/user-package.json`);
    } catch (error) {
        tarsUtils.tarsSay(chalk.yellow(error.message));
        tarsUtils.tarsSay(
            chalk.yellow(
                "Will continue without local user-package.json processing"
            )
        );
        currentUserPackageJson = {};
    }

    try {
        newUserPackageJson = require(`${destPath}/user-package.json`);
    } catch (error) {
        tarsUtils.tarsSay(chalk.yellow(error.message));
        tarsUtils.tarsSay(
            chalk.yellow("Will continue new local user-package.json processing")
        );
        newUserPackageJson = {};
    }

    newPackageJson = mergePackageJson(newPackageJson, currentUserPackageJson);
    newPackageJson = mergePackageJson(newPackageJson, newUserPackageJson);

    return newPackageJson;
};
