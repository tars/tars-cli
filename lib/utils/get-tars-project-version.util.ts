import { isTarsInited, tarsNotInitedActions } from "./";
const fsExtra = require("fs-extra");

export const getTarsProjectVersion = () => {
    const cwd = process.cwd();

    if (isTarsInited().inited) {
        return fsExtra.readJsonSync(`${cwd}/tars.json`).version;
    }

    tarsNotInitedActions();
    return false;
};
