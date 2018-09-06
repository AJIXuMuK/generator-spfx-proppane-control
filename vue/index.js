'use strict';

const Generator = require('yeoman-generator');
const utils = require('../common/utils');
// incldue nodejs fs
const fs = require('fs');

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

        this._copyShims();

        this._injectToGulpFile();

        utils.copyFile(this, this.templatePath('IPropertyField.ts'),
            `${this.outputFolder}/IPropertyField${this.normalizedNames.componentName}.ts`, this.normalizedNames);
        utils.copyFile(this, this.templatePath('IPropertyFieldHost.ts'),
            `${this.outputFolder}/IPropertyField${this.normalizedNames.componentName}Host.ts`, this.normalizedNames);
        utils.copyFile(this, this.templatePath('PropertyField.ts'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}.ts`, this.normalizedNames);
            utils.copyFile(this, this.templatePath('PropertyFieldHost.ts'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}Host.ts`, this.normalizedNames);
        utils.copyFile(this, this.templatePath('PropertyFieldHost.vue'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}Host.vue`, this.normalizedNames);
        utils.copyFile(this, this.templatePath('PropertyField.module.scss'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}.module.scss`, this.normalizedNames);
    }

    _getModulesToInstall() {
        const addonConfig = JSON.parse(
            fs.readFileSync(
                this.templatePath('config.json')
            )
        );
        return utils.getModulesToInstall(this, addonConfig);
    }

    _copyShims() {
        if (this.fs.exists(this.destinationPath('src/vue-shims.d.ts'))) {
            return;
        }

        this.fs.copy(this.templatePath('vue-shims.d.ts'),
            this.destinationPath('src/vue-shims.d.ts'));
    }

    _injectToGulpFile() {
        utils.injectToGulpFile(this, `\\{\\s*VueLoaderPlugin\\s*\\}\\s*=\\s*require\\(('|")vue-loader('|")\\);?`);
    }
}