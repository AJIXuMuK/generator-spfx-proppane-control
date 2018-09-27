'use strict';

// incldue nodejs fs
const fs = require('fs');
const commandExists = require('command-exists').sync;

module.exports = {
    copyFile: (yeoman, sourcePath, destinationPath, normalizedNames) => {
        let content = yeoman.fs.read(sourcePath).toString();
        const replacementRegExp = new RegExp(`{ComponentName}`, 'gm');
        content = content.replace(replacementRegExp, normalizedNames.componentName);
        yeoman.fs.write(destinationPath, content);

    },

    mergeConfig: (yeoman, additionalConfig, needToInstallObj) => {
        const config = yeoman.fs.readJSON(yeoman.destinationPath('package.json'));
        let deps = config.dependencies;
        let devDeps = config.devDependencies;

        if (additionalConfig.dependencies) {
            for (let depKey in additionalConfig.dependencies) {
                if (!deps[depKey]) {
                    needToInstallObj.flag = true;
                    deps[depKey] = additionalConfig.dependencies[depKey];
                }
            }
        }

        if (additionalConfig.devDependencies) {
            for (let devDepKey in additionalConfig.devDependencies) {
                if (!devDeps[devDepKey]) {
                    needToInstallObj.flag = true;
                    devDeps[devDepKey] = additionalConfig.devDependencies[devDepKey];
                }
            }
        }

        return config;
    },

    runInstall: (yeoman, additionalConfig) => {
        let needToInstall = {
            flag: false
        };
        const mergedConfig = module.exports.mergeConfig(yeoman, additionalConfig, needToInstall);
        if (!needToInstall.flag) {
            // no changes
            return;
        }
        fs.writeFileSync(yeoman.destinationPath('package.json'), JSON.stringify(mergedConfig, null, 2));
        const yorcPath = yeoman.destinationPath('.yo-rc.json');
        const yoConfig = yeoman.fs.readJSON(yorcPath);
        const packageManager = yoConfig.packageManager;

        if (packageManager === undefined ||
            packageManager.toLowerCase() === 'npm' ||
            packageManager.toLowerCase() === 'yarn') {

            let hasYarn = commandExists('yarn');

            // override yarn if npm is preferred
            if (packageManager === 'npm') {
                hasYarn = false;
            }

            yeoman.installDependencies({
                npm: !hasYarn,
                bower: false,
                yarn: hasYarn
            });

        } else {

            if (packageManager === 'pnpm') {

                const hasPnpm = commandExists('pnpm');

                if (hasPnpm) {
                    yeoman.spawnCommand('pnpm', ['install']);
                } else {
                    throw 'Cannot find pnpm';
                }

            } else {

                throw 'Error: Package Manager not defined ' + packageManager;

            }

        }
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