const fs = require('fs');
const path = require('path');
const prettier = require('prettier');


const START_TEXT = "# GIT_COMMIT_MSG_VALIDATOR_START";
const END_TEXT = "# GIT_COMMIT_MSG_VALIDATOR_END";
const RUN_HOOK = "./node_modules/.bin/git-commit-msg-validator-run-hook";
const SHE_BANG = "#!/bin/sh";
const VERSION = "1.1.3"

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

        if(text[0] !== '/') return false;

        const regexp = eval(text);

        return regexp;
    } catch(e) {
        return false;
    }
}

function isMetaDataSet() {
    const packageJsonContent = getPackageJson();

    return !!packageJsonContent['packageJsonContent']['git-commit-msg-validator'];
}

function setMetaData(text, rootPath) {
    const packageJsonContent = getPackageJson(rootPath);
    packageJsonContent['packageJsonContent']['git-commit-msg-validator'] = text;
    if(packageJsonContent['packageJsonContent']['devDependencies'] === undefined) {
        packageJsonContent['packageJsonContent']['devDependencies'] = {};
    }
    if(packageJsonContent['packageJsonContent']['scripts'] === undefined) {
        packageJsonContent['packageJsonContent']['scripts'] = {};
    }
    if(packageJsonContent['packageJsonContent']['devDependencies']["git-commit-msg-validator"] === undefined) {
        packageJsonContent['packageJsonContent']['devDependencies']["git-commit-msg-validator"] = "^" + VERSION;
    }
    if(packageJsonContent['packageJsonContent']['scripts']['postinstall']) {
        if(!packageJsonContent['packageJsonContent']['scripts']['postinstall'].includes('git-commit-msg-validator')) {
            packageJsonContent['packageJsonContent']['scripts']['postinstall'] += " & git-commit-msg-validator";
        }
    } else {
        packageJsonContent['packageJsonContent']['scripts']['postinstall'] = 'git-commit-msg-validator';
    }
    const contents = prettier.format(JSON.stringify(packageJsonContent.packageJsonContent), {parser : 'json'});
    fs.writeFileSync(packageJsonContent.packageJsonPath, contents, {encoding: 'utf8'});
}

function getMetaData(rootPath) {
    const packageJsonContent = getPackageJson(rootPath);
    return packageJsonContent['packageJsonContent']['git-commit-msg-validator'].replace(/\\\\/gi, '\\');
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

function getCommitMsg() {
    const gitRoot = getGitProjectRoot();
    const commitMsgFile = path.join(gitRoot, 'COMMIT_EDITMSG');

    if(fs.existsSync(commitMsgFile)) {
        const commitMsg = fs.readFileSync(commitMsgFile, {encoding:'utf-8'});

        return commitMsg;
    }

    return "";
}

function setHooks() {
    const gitRoot = getGitProjectRoot();
    const hooksDir = path.join(gitRoot, 'hooks');
    const commitMsgFilePath = path.join(hooksDir, '/commit-msg');
    
    const HOOK_TEXT = "\n" + START_TEXT + "\n" + RUN_HOOK + "\n" + END_TEXT + "\n";

    if(fs.existsSync(commitMsgFilePath)) {
        let commitMsgContent = fs.readFileSync(commitMsgFilePath, {encoding: "utf-8"});

        const startIdx = commitMsgContent.indexOf(START_TEXT);
        const endIdx = commitMsgContent.indexOf(END_TEXT);

        // If there is no SHE_BANG.
        if(commitMsgContent.indexOf(SHE_BANG) === -1) {
            commitMsgContent = SHE_BANG + '\n' + commitMsgContent;
        }

        if(startIdx !== -1 && endIdx !== -1) {
            const innerText = commitMsgContent.slice(startIdx + START_TEXT.length, endIdx);
            const newContent = commitMsgContent.replace(innerText, "\n" + RUN_HOOK + "\n");
            fs.writeFileSync(commitMsgFilePath, newContent, {encoding: 'utf-8'});
        } else {
            fs.writeFileSync(commitMsgFilePath, commitMsgContent + HOOK_TEXT, {encoding: 'utf-8'});
        }
    } else {
        fs.writeFileSync(commitMsgFilePath, SHE_BANG + HOOK_TEXT, {encoding: 'utf-8'});
    }

    fs.chmodSync(commitMsgFilePath, 0o0755);
}

module.exports = { 
    isMetaDataSet,
    setMetaData,
    getMetaData,
    isValidArrayText,
    isValidRegexp,
    setHooks,
    getCommitMsg,
    getPackageJson
}