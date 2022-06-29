const { getMetaData } = require('../../src/git-commit-msg-validator');
const ROOT_PATH = './__test__/types-mode';
const regexp = /^\[[\S]+\] [\S\s]+\s:\s[\S\s]+/;

describe('Test for types-mode', () => {
    let types = null;

    beforeEach(() => {
        types = JSON.parse(getMetaData(ROOT_PATH));
    })

    test('Not valid message format', () => {
        const commitMsg = "test-commit msg";

        expect(regexp.test(commitMsg)).toBe(false);
    });

    test('Valid message format, but type is not in meta data.', () => {
        const commitMsg = "[delete] delete : delete a.js file.";
        const closeIndex = commitMsg.indexOf(']');
        const type = commitMsg.slice(1, closeIndex);

        expect(regexp.test(commitMsg)).toBe(true);
        expect(types.includes(type)).toBe(false);
    });
    
    test('Valid message format, type is in meta data.', () => {
        const commitMsg = "[update] update : update a.js file.";
        const closeIndex = commitMsg.indexOf(']');
        const type = commitMsg.slice(1, closeIndex);

        expect(regexp.test(commitMsg)).toBe(true);
        expect(types.includes(type)).toBe(true);
    })
})