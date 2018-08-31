'use strict';

const Generator = require('yeoman-generator');
const utils = require('../common/utils');
const reactJson = require('@microsoft/generator-sharepoint/lib/common/dependency/react.json')

module.exports = class extends Generator {
    constructor(args, options) {
        super(args, options);

        this.normalizedNames = options.normalizedNames;
        this.outputFolder = options.outputFolder;
    }

    install() {
        const modulesToInstall = this._getModulesToInstall();

        if (modulesToInstall.dependencies.length) {
            this.npmInstall(modulesToInstall.dependencies, { 'save': true, 'save-exact': true });
        }

        if (modulesToInstall.devDependencies.length) {
            this.npmInstall(modulesToInstall.devDependencies, { 'save-dev': true, 'save-exact': true });
        }


        utils.copyFile(this.fs, this.templatePath('IPropertyField.ts'),
            `${this.outputFolder}/IPropertyField${this.normalizedNames.componentName}.ts`, this.normalizedNames);
            utils.copyFile(this.fs, this.templatePath('IPropertyFieldHost.ts'),
            `${this.outputFolder}/IPropertyField${this.normalizedNames.componentName}Host.ts`, this.normalizedNames);
        utils.copyFile(this.fs, this.templatePath('PropertyField.ts'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}.ts`, this.normalizedNames);
            utils.copyFile(this.fs, this.templatePath('PropertyFieldHost.tsx'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}Host.tsx`, this.normalizedNames);
        utils.copyFile(this.fs, this.templatePath('PropertyField.module.scss'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}.module.scss`, this.normalizedNames);
    }

    _getModulesToInstall() {
        const packageJsonContent = this.fs.readJSON(this.destinationPath('package.json'));
        const packageJsonDeps = packageJsonContent.dependencies || {};
        const packageJsonDevDeps = packageJsonContent.devDependencies || {};
        const reactJsonDeps = reactJson.dependencies || {};
        const reactJsonDevDeps = reactJson.devDependencies || {};

        const resultDeps = [];
        const resultDevDeps = [];

        Object.keys(reactJsonDeps).forEach(key => {
            if (!packageJsonDeps[key]) {
                resultDeps.push(`${key}@${reactJsonDeps[key]}`);
            }
        });

        Object.keys(reactJsonDevDeps).forEach(key => {
            if (!packageJsonDevDeps[key]) {
                resultDevDeps.push(`${key}@${reactJsonDevDeps[key]}`);
            }
        });

        return {
            dependencies: resultDeps,
            devDependencies: resultDevDeps
        };
    }
}