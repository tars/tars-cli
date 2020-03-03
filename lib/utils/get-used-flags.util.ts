/**
 * Extract only used flags from inquirer options
 * @param  {Object} Inquirer options
 * @return {Array}
 */
export const getUsedFlags = (inquirerOptions: any) => {
    return Object.keys(inquirerOptions).reduce((result, currentValue) => {
        if (
            currentValue.indexOf("_") !== 0 &&
            currentValue !== "options" &&
            currentValue !== "commands" &&
            currentValue !== "parent"
        ) {
            // @ts-ignore
            result.push(currentValue);
        }

        return result;
    }, []);
};