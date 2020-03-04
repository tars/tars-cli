const inquirer = require('inquirer');
import chalk from 'chalk';

module.exports = {
    /**
     * Generate choices for inquirer checkbox list
     * @param  {Object} promtOptions promtOptions from constants
     * @param  {Number} activeIndex  Index of checked element
     * @return {Array}
     */
    generateForCheckboxList(promtOptions: any, activeIndex: any) {
        activeIndex = activeIndex || 0;

        const listHeader = new inquirer.Separator(chalk.grey('—— Press <space> to select ——'));
        const listFooter = new inquirer.Separator(chalk.grey('—————————————————————————————'));
        const choisesList = Object.keys(promtOptions).reduce((result, optionKey, index) => {
            const generatedChoise = {
                name: promtOptions[optionKey].title
            };

            if (index === activeIndex) {
                // @ts-ignore
                generatedChoise.checked = true;
            }

            // @ts-ignore
            result.push(generatedChoise);

            return result;
        }, []);

        return [].concat(
            listHeader,
            choisesList,
            listFooter
        );
    },

    /**
     * Generate choices for inquirer simple list
     * @param  {Object} promtOptions promtOptions from constants
     * @return {Array}
     */
    generateForSimpleList(promtOptions: any) {
        return Object.keys(promtOptions).reduce((result, optionKey) => {
            // @ts-ignore
            result.push(promtOptions[optionKey].title);

            return result;
        }, []);
    }
};
