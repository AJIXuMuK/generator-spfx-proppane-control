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
        this._copyShims();

        this._injectToGulpFile();

        utils.copyFile(this, this.templatePath('IPropertyField.ts'),
            `${this.outputFolder}/IPropertyField${this.normalizedNames.componentName}.ts`, this.normalizedNames);
        utils.copyFile(this, this.templatePath('IPropertyFieldHost.ts'),
            `${this.outputFolder}/IPropertyField${this.normalizedNames.componentName}Host.ts`, this.normalizedNames);
        utils.copyFile(this, this.templatePath('PropertyField.ts'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}.ts`, this.normalizedNames);
        utils.copyFile(this, this.templatePath('PropertyFieldHost.vue'),
            `${this.outputFolder}/PropertyField${this.normalizedNames.componentName}Host.vue`, this.normalizedNames);

        utils.runInstall(this, JSON.parse(fs.readFileSync(this.templatePath('config.json'))));
    }

    _copyShims() {
        if (this.fs.exists(this.destinationPath('src/vue-shims.d.ts'))) {
            return;
        }

        this.fs.copy(this.templatePath('vue-shims.d.ts'),
            this.destinationPath('src/vue-shims.d.ts'));
    }

    _injectToGulpFile() {
        utils.injectToGulpFile(this, `\\s*VueLoaderPlugin\\s*=\\s*require\\(('|")vue-loader/lib/plugin('|")\\);?`);
    }
}