#!/usr/bin/env node

const chalk = require('chalk');
const { getMetaData, isValidArrayText, isValidRegexp, getCommitMsg } = require('./git-commit-msg-validator')
const commitMsg = getCommitMsg();

const INVALID_COMMIT_MESSAGE = chalk.red.bold("Invalid Commit Message Format");
const VALID_COMMIT_MESSAGE = chalk.yellow("Valid Format is [{TYPE}] {TITLE} : {DESCRIPTION}");
const INVALID_TYPE = chalk.red.bold("Invalid Type");
const VALID_TYPES = (types) => chalk.yellow(`Valid Types are in Array(${types.length}) [ ${types.join(', ')} ]\nYou can find in package.json`);
const CHECK_REGEXP = chalk.yellow("Check Regular Expression in package.json")

if(!commitMsg) throw Error(INVALID_COMMIT_MESSAGE);


const metaData = getMetaData();

if(isValidArrayText(metaData)) {
    const types = JSON.parse(metaData);
    const regexp = /^\[[\S]+\] [\S\s]+\s:\s[\S\s]+/;

    if(regexp.test(commitMsg) === false) throw Error(INVALID_COMMIT_MESSAGE + "\n" + VALID_COMMIT_MESSAGE);

    const closeIndex = commitMsg.indexOf(']');

    const type = commitMsg.slice(1, closeIndex);
    if(types.includes(type) === false) throw Error(INVALID_TYPE + "\n" + VALID_TYPES(types));

} else if(isValidRegexp(metaData)) {
    const regexp = isValidRegexp(metaData);
    if(regexp.test(commitMsg) === false) throw Error(INVALID_COMMIT_MESSAGE + "\n" + CHECK_REGEXP);

} else {
    throw Error(INVALID_COMMIT_MESSAGE);
}


