const fs = require('fs');
const path = require('path');

function _getPackageJson(projectPath = process.cwd()) {
    if (typeof projectPath !== "string") {
        throw TypeError("projectPath is not a string");
    }

    const targetPackageJson = path.normalize(projectPath + '/package.json');

    if (!fs.statSync(targetPackageJson).isFile()) {
        throw Error("Package.json doesn't exist");
    }

    const packageJsonDataRaw = fs.readFileSync(targetPackageJson);
    return { packageJsonContent: JSON.parse(packageJsonDataRaw), packageJsonPath: targetPackageJson };
}

function isValidArrayText(text) {
    try {
        const obj = JSON.parse(text);
        return Array.isArray(obj);
    } catch(e) {
        return false;
    }
}

function isValidRegexp(text) {
    try {
        const regexp = new RegExp(text);

        return regexp;
    } catch(e) {
        return false;
    }
}

function isHooksSet() {
    const packageJsonContent = _getPackageJson();

    return !!packageJsonContent['packageJsonContent']['git-commit-msg-validation'];
}

/**
 * @todos
 * Need fix JSON.stringify() part. 
 * It converts JSON object to ugly one line text now.
 */
function setHooks(text) {
    const packageJsonContent = _getPackageJson();
    packageJsonContent['packageJsonContent']['git-commit-msg-validation'] = text;
    fs.writeFileSync(packageJsonContent.packageJsonPath, JSON.stringify(packageJsonContent.packageJsonContent), {encoding: 'utf8'});
}

module.exports = { 
    isHooksSet,
    setHooks,
    isValidArrayText,
    isValidRegexp
}