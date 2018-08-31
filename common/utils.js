'use strict';

module.exports = {};

module.exports.copyFile = function(fs, sourcePath, destinationPath, normalizedNames) {
    let content = fs.read(sourcePath).toString();
    const replacementRegExp = new RegExp(`{ComponentName}`, 'gm');
    content = content.replace(replacementRegExp, normalizedNames.componentName);
    fs.write(destinationPath, content);

}