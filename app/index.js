'use strict';

const Generator = require('yeoman-generator');
const lodash = require('lodash');
const path = require("path");
const yosay = require('yosay');
const chalk = require('chalk');

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);
    }

    initializing() {
        this.log(yosay(
            chalk.white('Welcome to\n') +
            chalk.white.bold('SPFx Property Pane Field Control\n') +
            chalk.white('Generator')
        ));
    }

    prompting() {
        return this.prompt([{
            type: 'input',
            name: 'controlName',
            default: 'Description',
            message: 'What is your Property Pane Field Control name?',
            validate: (input) => {
                const normalizedNames = this._normalizeComponentNames(input);
                const outputFolderPath = this._getOutputFolder(normalizedNames.componentNameCamelCase);
                if (this.fs.exists(outputFolderPath)) {
                    console.log(chalk.yellow(`\nThe folder "${outputFolderPath}" already exists.`
                        + ` Please choose a different name for your component.`));
                    return false;
                }
                // disallow quotes, since this will mess with the JSON we put this string into
                if (input.indexOf('"') !== -1) {
                    console.log(chalk.yellow(`\nDo not use double quotes in your title.`));
                    return false;
                }
                return true;
            }
        }, {
            type: 'list',
            name: 'framework',
            default: 'none',
            message: 'Which framework would you like to use?',
            choices: [
                { name: 'No JavaScript framework', value: 'none' },
                { name: 'React', value: 'react' },
                { name: 'Vue.js', value: 'vue' }
            ]

        }]).then((answers) => {
            const normalizedNames = this._normalizeComponentNames(answers.controlName);
            const framework = answers.framework;
            const options = JSON.parse(JSON.stringify(this.options || {}));
            options.normalizedNames = normalizedNames;
            options.outputFolder = this._getOutputFolder(normalizedNames.componentNameCamelCase);
            switch (framework) {
                case 'none':
                    this.composeWith(require.resolve('../noframework'), options);
                    break;
                case 'react':
                    this.composeWith(require.resolve('../react'), options);
                    break;
                case 'vue':
                    this.composeWith(require.resolve('../vue'), options);
                    break;
            }
        });
    }

    _normalizeComponentNames(componentNameUnescaped) {
        const componentName = this._titleCase(componentNameUnescaped);
        const componentNameCamelCase = lodash.camelCase(componentName);
        const componentClassName = `PropertyField${componentName}`;
        const componentClassHostName = `PropertyField${componentName}Host`;
        return {
            componentNameUnescaped,
            componentName,
            componentNameCamelCase,
            componentClassName,
            componentClassHostName
        };
    }

    _titleCase(str) {
        str = lodash.camelCase(str);
        return lodash.upperFirst(str);
    }

    /**
     * gets folder in destination
     */
    _getOutputFolder(componentNameCamelCase) {
        return path.join(this.destinationRoot(), 'src', 'propertyFields', componentNameCamelCase);
    }
}