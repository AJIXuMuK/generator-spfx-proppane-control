'use strict';

// incldue nodejs fs
const fs = require('fs');

module.exports = {
    copyFile: (yeoman, sourcePath, destinationPath, normalizedNames) => {
        let content = yeoman.fs.read(sourcePath).toString();
        const replacementRegExp = new RegExp(`{ComponentName}`, 'gm');
        content = content.replace(replacementRegExp, normalizedNames.componentName);
        yeoman.fs.write(destinationPath, content);

    },

    getModulesToInstall: (yeoman, addonConfig) => {
        const packageJsonContent = yeoman.fs.readJSON(yeoman.destinationPath('package.json'));
        const packageJsonDeps = packageJsonContent.dependencies || {};
        const packageJsonDevDeps = packageJsonContent.devDependencies || {};
        const deps = addonConfig.dependencies || {};
        const devDeps = addonConfig.devDependencies || {};

        const resultDeps = [];
        const resultDevDeps = [];

        Object.keys(deps).forEach(key => {
            if (!packageJsonDeps[key]) {
                resultDeps.push(`${key}@${deps[key]}`);
            }
        });

        Object.keys(devDeps).forEach(key => {
            if (!packageJsonDevDeps[key]) {
                resultDevDeps.push(`${key}@${devDeps[key]}`);
            }
        });

        return {
            dependencies: resultDeps,
            devDependencies: resultDevDeps
        };
    },

    composeGulpFile: (customTemplate, outputFile, compareRegExpStr) => {

        if (!fs.existsSync(customTemplate)) {
            const error = 'Error: File names ' + customTemplate + ' cannot be found';
            throw error;
        }

        let outputFileContent = fs.readFileSync(outputFile, 'utf-8');

        let compareRegExp = new RegExp(compareRegExpStr, 'gm');
        if (compareRegExp.test(outputFileContent)) {
            // the gulpfile has been already modified
            return;
        }

        let customTemplateContent = fs.readFileSync(customTemplate, 'utf-8');

        let gulpFileContent = outputFileContent.replace(/build\.initialize\(gulp\);/g, `${customTemplateContent}\nbuild.initialize(gulp);`);

        try {

            fs.writeFileSync(outputFile, gulpFileContent, 'utf-8');

        } catch (error) {

            throw error;

        }

    },

    injectToGulpFile: (yeoman, compareRegExpStr) => {
        let targetGulpFile = yeoman.destinationPath('gulpfile.js');

        if (fs.existsSync(targetGulpFile)) {
            let customGulpTemplate = yeoman.templatePath('./gulpfile.js');

            try {

                module.exports.composeGulpFile(customGulpTemplate, targetGulpFile, compareRegExpStr);

            } catch (error) {

                yeoman.log(error);

            }

        }
    }
}