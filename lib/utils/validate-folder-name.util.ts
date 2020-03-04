/**
 * Validate folder name
 * @param  {String}                     Value Recieved folder name
 * @return {Boolean || String}          True or error text (not consistent, because of inquirer va)
 */
export const validateFolderName = (value: string) => {
    const pass = /[?<>:*|"\\]/.test(value);

    if (!pass) {
        return true;
    }

    return 'Symbols \'?<>:*|"\\\' are not allowed. Please, enter a valid folder name!';
};
