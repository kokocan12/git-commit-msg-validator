const { getMetaData, isValidRegexp } = require('../../src/git-commit-msg-validator');
const ROOT_PATH = './__test__/regexp-mode';


describe('Test for regexp-mode', () => {
    let regexp = null;

    beforeEach(() => {
        const meta = getMetaData(ROOT_PATH);
        regexp = isValidRegexp(meta);
    })

    test('Not valid message format', () => {
        const commitMsg = "test-commit msg";

        expect(regexp.test(commitMsg)).toBe(false);
    });

    test('Valid message format', () => {
        const commitMsg = "[test] test : test";

        expect(regexp.test(commitMsg)).toBe(true);
    })
});