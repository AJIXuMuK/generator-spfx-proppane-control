'use strict';

const Generator = require('yeoman-generator');
const utils = require('../common/utils');

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);

        this.normalizedNames = options.normalizedNames;
        this.outputFolder = options.outputFolder;
    }

    install() {
        utils.copyFile(this.fs, this.templatePath('IPropertyField.ts'),
            `${this.outputFolder}/IPropertyField${this.normalizedNames.componentName}.ts`, this.normalizedNames);
        utils.copyFile(this.fs, this.templatePath('PropertyField.ts'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}.ts`, this.normalizedNames);
        utils.copyFile(this.fs, this.templatePath('PropertyField.module.scss'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}.module.scss`, this.normalizedNames);
    }
}