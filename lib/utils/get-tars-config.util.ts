import { isTarsInited, tarsNotInitedActions } from "./";

/**
 * Gets TARS-config from TARS in current directory.
 * @return {boolean | object} tars-config
 */
export const getTarsConfig = () => {
    const cwd = process.cwd();
    const initedStatus = isTarsInited();

    if (initedStatus.inited && !initedStatus.error) {
        return require(`${cwd}/tars-config`);
    }

    if (!initedStatus.error) {
        tarsNotInitedActions();
    }
    return false;
};
