"use strict";

const Download = require("download");
const exec = require("child_process").exec;
const extfs = require("extfs");
const del = require("del");
const fs = require("fs");
const chalk = require("chalk");
const runCommand = require("./utils/run-command");
const tarsUtils = require("../utils");
const configPromt = require("../promt/config-promt");
const fsPromt = require("../promt/fs-promt");
const saveConfigAnswers = require("../promt/save-config-answers");
let tarsZipUrl = "https://github.com/tars/tars/archive/master.zip";
let commandOptions = {};

/**
 * Main init funciton, download all additional tasks.
 * @param  {Object} answers         Object with answers from promt
 */
function mainInit(answers) {
    const cwd = process.cwd();
    const downloadTars = new Download({
        mode: "755",
        extract: true,
        strip: 1
    })
        .get(tarsZipUrl)
        .dest(cwd);

    tarsUtils.tarsSay("Please, wait for a moment, while magic is happening...");

    downloadTars.run(downloadErr => {
        let commandToExec = "npm i && npm i gulp@4.0.2 --save-dev";

        if (downloadErr) {
            tarsUtils.spinner.stop(true);
            throw downloadErr;
        }

        if (answers) {
            saveConfigAnswers(answers);
        }

        const userPackages = require(`${cwd}/user-package.json`);

        // Get version of TARS from tars.json
        // or package.json if tars.json does not exist
        try {
            process.env.tarsVersion = tarsUtils.getTarsProjectVersion();
        } catch (error) {
            process.env.tarsVersion = require(`${cwd}/package.json`).version;
        }

        tarsUtils.tarsSay(`TARS version is: ${process.env.tarsVersion}`);

        del.sync([
            `${cwd}/package.json`,
            `${cwd}/user-package.json`,
            `${cwd}/_package.json`
        ]);

        let packageJson = {};

        packageJson = Object.assign(
            require(`${process.env.cliRoot}/templates/package.json`),
            userPackages
        );

        fs.writeFileSync(
            "package.json",
            JSON.stringify(packageJson, null, 2) + "\n"
        );
        tarsUtils.tarsSay("Local package.json has been created");

        const tarsConfig = require(`${cwd}/tars-config.js`);

        if ((answers && answers.useBabel) || tarsConfig.useBabel) {
            commandToExec +=
                ' && npm i --save @babel/preset-env@"<8.0.0"  @babel/core@"<8.0.0"';
        }

        exec(commandToExec, (error, stdout, stderr) => {
            if (error) {
                console.log(stderr);
                return;
            }

            let gulpInitCommandOptions = ["init", "--silent"];

            if (commandOptions.excludeCss) {
                gulpInitCommandOptions.push("--exclude-css");
            }

            if (commandOptions.excludeHtml) {
                gulpInitCommandOptions.push("--exclude-html");
            }

            tarsUtils.tarsSay(
                "Local gulp and other dependencies has been installed"
            );
            runCommand("gulp", gulpInitCommandOptions);
        });
    });
}

/**
 * Start initialization
 */
function startInit() {
    const cwd = process.cwd();

    tarsUtils.tarsSay(
        chalk.underline("Initialization has been started!") + "\n"
    );
    tarsUtils.tarsSay("I'll be inited in " + chalk.cyan('"' + cwd + '"'));
    tarsUtils.tarsSay(
        "TARS source will be downloaded from " +
            chalk.cyan('"' + tarsZipUrl + '"')
    );

    if (!commandOptions.source) {
        tarsUtils.tarsSay(
            "You can specify source url by using flag " +
                chalk.cyan('"--source"') +
                " or " +
                chalk.cyan('"-s"')
        );
        tarsUtils.tarsSay(
            "Example: " +
                chalk.cyan('"tars init -s http://url.to.zip.with.tars"')
        );
        tarsUtils.tarsSay(
            "Run command " +
                chalk.cyan('"tars init --help"') +
                " for more info.\n"
        );
    }

    tarsUtils.tarsSay(
        'I\'m going to install "gulp" localy and create local package.json'
    );
    tarsUtils.tarsSay(
        "You can modify package.json by using command " +
            chalk.cyan('"npm init"') +
            " or manually."
    );

    if (commandOptions.silent) {
        mainInit();
    } else {
        configPromt(mainInit);
    }
}

/**
 * Init TARS
 * @param  {Object} options Options of init
 */
module.exports = function init(options) {
    const cwd = process.cwd();

    commandOptions = options;
    tarsUtils.spinner.start();

    if (options.source) {
        tarsZipUrl = options.source;
    }

    if (tarsUtils.isTarsInited().inited) {
        tarsUtils.tarsSay("TARS has been inited already!");
        tarsUtils.tarsSay(
            "You can't init Tars in current directory again.",
            true
        );
        return;
    }

    console.log("\n");
    extfs.isEmpty(cwd, empty => {
        if (!empty) {
            tarsUtils.tarsSay(
                chalk.red(`Directory "${cwd}" is not empty.`),
                true
            );
            fsPromt(startInit);
        } else {
            startInit();
        }
    });
};
