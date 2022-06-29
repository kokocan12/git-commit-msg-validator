#!/usr/bin/env node
const { exit } = require('process');
const readline = require('readline');
const chalk = require('chalk');
const { isMetaDataSet, setMetaData, isValidArrayText, isValidRegexp, setHooks } = require('./git-commit-msg-validator');
const { exec } = require('child_process');

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const KEY = {
    up: '\x1B[A',
    down: '\x1B[B',
    left: '\x1B[D',
    right: '\x1B[C',
    enter: '\r',
    ctrlC: '\x03'
}

const MODE = {
    selectMode: 0b0,
    typeMode: 0b1
}

const TEXT = {
    select: chalk.green.bold("1. Select git commit message validation mode\n"),
    option1: "(1) Use type selection 👈\n(2) Use regexp\n",
    option2: "(1) Use type selection\n(2) Use regexp         👈\n",
    selectComplete1: chalk.yellow("You selected type selection mode.\n"),
    selectComplete2: chalk.yellow("You selected regexp mode.\n"),
    typeSelection: chalk.green.bold('2. Please, insert types what you use. ex) ["fix", "update", "feat"]\n'),
    regexpSelection: chalk.green.bold('2. Please, insert regexp what you use. ex) /[0-9]+/ \n'),
    wrongText: " is not valid text format, please try again.\n",
    alreadySet: chalk.yellow.bold("\ngit-commit-msg-validator property is already set in package.json\n")
}

let currentSelect = 0;
let nextSelect = 0;
let currentMode = MODE.selectMode;
let textValue = "";

function clear() {
    for(let i=0; i<3; i++) {
        process.stdout.clearLine();
        if(i !== 2) process.stdout.moveCursor(0, -1);
    }
}
function renderSelect() {
    if(currentSelect === nextSelect) return;
    clear();
    if(nextSelect === 0) {
        process.stdout.write(TEXT.option1);
    } else {
        process.stdout.write(TEXT.option2);
    }

    currentSelect = nextSelect;
}

function readTypeValue() {
    read.question('', (input) => {
        if(isValidArrayText(input)) {
            textValue = input;
            setMetaData(textValue);
            setHooks();
            read.close();
            exit();
        } else {
            process.stdout.write(input + TEXT.wrongText);
            readTypeValue();
        }    
    });
}

function readRegexpValue() {
    read.question('', (input) => {
        if(isValidRegexp(input)) {
            textValue = input;
            setMetaData(textValue);
            setHooks();
            read.close();
            exit();
        } else {
            process.stdout.write(input + TEXT.wrongText);
            readRegexpValue();
        }    
    });
}

function init() {
    process.stdout.write("\n" + TEXT.select);
    process.stdout.write(TEXT.option1);
    process.stdin.on('keypress', (_, key) => {

        if(currentMode !== MODE.selectMode) return;

        if(key.sequence === KEY.up || key.sequence === KEY.left) {
            nextSelect = 0;
            renderSelect();
        }
        else if(key.sequence === KEY.down || key.sequence === KEY.right) {
            nextSelect = 1;
            renderSelect();
        }
        else if(key.sequence === KEY.enter) {
            currentMode = MODE.typeMode;
            if(currentSelect === 0) {
                process.stdout.write(TEXT.selectComplete1);
                process.stdout.write(TEXT.typeSelection);
                readTypeValue()
            } else if(currentSelect === 1) {
                process.stdout.write(TEXT.selectComplete2);
                process.stdout.write(TEXT.regexpSelection);
                readRegexpValue()
            }
            return;
        }
        else if(key.sequence === KEY.ctrlC) exit();
    });
}


if(!isMetaDataSet()) {
    // setMetaData
    init();
    exec("npm install");
} else {
    // setGitHooks
    setHooks()
    process.stdout.write(TEXT.alreadySet);
    exit();
}



