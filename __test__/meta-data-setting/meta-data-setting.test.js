const { setMetaData, getMetaData, getPackageJson } = require('../../src/git-commit-msg-validator');
const ROOT_PATH = './__test__/meta-data-setting';
const fs = require('fs');

const DEFAULT_PACKAGEJSON_CONTENT = `{
    "name": "test",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT",
    "scripts": {
      "postinstall": "git-commit-msg-validator"
    },
    "dependencies": {
      "git-commit-msg-validator": "^1.0.4"
    }    
}`


describe('Test for meta-data setting', () => {

    beforeEach(() => {
        const packageJsonContent = getPackageJson(ROOT_PATH);
        fs.writeFileSync(packageJsonContent.packageJsonPath, DEFAULT_PACKAGEJSON_CONTENT, {encoding: 'utf8'});
    })

    test('normal text', () => {
        const text = "1232891245";

        setMetaData(text, ROOT_PATH);
        const metaData = getMetaData(ROOT_PATH);

        expect(text).toBe(metaData);
    });

    test('array text', () => {
      const text = `["update", "fix"]`;

      setMetaData(text, ROOT_PATH);
      const metaData = getMetaData(ROOT_PATH);

      
      expect(text).toBe(metaData);
    })

    test('regexp text', () => {
      const text = /^\[[\S]+\] [\S\s]+\s:\s[\S\s]+/.toString();

      setMetaData(text, ROOT_PATH);
      const metaData = getMetaData(ROOT_PATH);

      expect(text).toBe(metaData);
    })
});