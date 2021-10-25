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

  //
  // synced with https://github.com/pnp/generator-spfx/blob/master/generators/vuejs/index.js
  //
  _copyShims() {
    // deploy vue shims
    if (!fs.existsSync(this.destinationPath('types/vue/shims-vue.d.ts'))) {

      this.fs.copy(
        this.templatePath('types/vue/shims-vue.d.ts'),
        this.destinationPath('types/vue/shims-vue.d.ts')
      );

    }

    // deploy tsx shims
    if (!fs.existsSync(this.destinationPath('types/vue/shims-tsx.d.ts'))) {

      this.fs.copy(
        this.templatePath('types/vue/shims-tsx.d.ts'),
        this.destinationPath('types/vue/shims-tsx.d.ts')
      );

    }

    // Update TS Config for Shims
    if (fs.existsSync(this.destinationPath('tsconfig.json'))) {

      let tsconfig = fs.readFileSync('tsconfig.json', 'utf-8');

      try {

        let tsconfigJson = JSON.parse(tsconfig);

        // Add additinal typing root
        if (tsconfigJson !== undefined &&
          tsconfigJson.compilerOptions !== undefined &&
          tsconfigJson.compilerOptions.typeRoots !== undefined &&
          tsconfigJson.compilerOptions.typeRoots.indexOf('./types') === -1) {

          tsconfigJson.compilerOptions.typeRoots.push('./types');

        }

        // Add additional typing include
        if (tsconfigJson !== undefined &&
          tsconfigJson.include !== undefined &&
          tsconfigJson.include.indexOf('types/**/*.d.ts') === -1) {

          tsconfigJson.include.push('types/**/*.d.ts');

        }

        // Udpate TS Config
        fs.writeFileSync(
          this.destinationPath('tsconfig.json'),
          JSON.stringify(tsconfigJson, null, 2)
        )

      } catch (error) {

        this.log('There was an update writing the tsconfig.json: ', error);

      }

    }
  }

  _injectToGulpFile() {
    utils.injectToGulpFile(this, `\\s*VueLoaderPlugin\\s*=\\s*require\\(('|")vue-loader/lib/plugin('|")\\);?`);
  }
}