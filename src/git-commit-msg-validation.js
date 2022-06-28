const fs = require('fs');
const path = require('path');


const START_TEXT = "# GIT_COMMIT_MSG_VALIDATION_START";
const END_TEXT = "# GIT_COMMIT_MSG_VALIDATION_END"

function getPackageJson(projectPath = process.cwd()) {
    if (typeof projectPath !== "string") {
        throw Error("projectPath is not a string");
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

function isMetaDataSet() {
    const packageJsonContent = getPackageJson();

    return !!packageJsonContent['packageJsonContent']['git-commit-msg-validation'];
}

/**
 * @todos
 * Need fix JSON.stringify() part. 
 * It converts JSON object to ugly one line text now.
 */
function setMetaData(text) {
    const packageJsonContent = getPackageJson();
    packageJsonContent['packageJsonContent']['git-commit-msg-validation'] = text;
    fs.writeFileSync(packageJsonContent.packageJsonPath, JSON.stringify(packageJsonContent.packageJsonContent), {encoding: 'utf8'});
}

function getMetaData() {
    const packageJsonContent = getPackageJson();
    return packageJsonContent['packageJsonContent']['git-commit-msg-validation']
}

function getGitProjectRoot(directory=process.cwd()) {
    let start = directory;
    if (typeof start === 'string') {
        if (start[start.length - 1] !== path.sep) {
            start += path.sep;
        }
        start = path.normalize(start);
        start = start.split(path.sep);
    }
    if (!start.length) {
        return undefined;
    }
    start.pop();

    let dir = start.join(path.sep);
    let fullPath = path.join(dir, '.git');

    if (fs.existsSync(fullPath)) {
        if(!fs.lstatSync(fullPath).isDirectory()) {
            let content = fs.readFileSync(fullPath, { encoding: 'utf-8' });
            let match = /^gitdir: (.*)\s*$/.exec(content);
            if (match) {
                return path.normalize(match[1]);
            }
        }
        return path.normalize(fullPath);
    } else {
        return getGitProjectRoot(start);
    }
}

function setHooks() {
    const gitRoot = getGitProjectRoot();
    const hooksDir = gitRoot + '/hooks';
    const commitMsgFilePath = hooksDir + '/commit-msg';

    if(fs.existsSync(commitMsgFilePath)) {
        const commitMsgContent = fs.readFileSync(hooksDir + '/commit-msg', {encoding: "utf-8"});
        console.log(commitMsgContent)
    } else {
        const contents = START_TEXT + "\n" + "git-commit-msg-validation-run-hook" + "\n" + END_TEXT;
        fs.writeFileSync(commitMsgFilePath, contents, {encoding: 'utf-8'});    
    }

    fs.chmodSync(commitMsgFilePath, 0o0755);
}

module.exports = { 
    isMetaDataSet,
    setMetaData,
    getMetaData,
    isValidArrayText,
    isValidRegexp,
    setHooks
}