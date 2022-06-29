const fs = require('fs');
const prettier = require('prettier');
const ROOT_PATH = './__test__/format-text';


describe('Tests for text formatting', () => {
    test('format', () => {

        const raw = JSON.stringify(JSON.parse(fs.readFileSync(ROOT_PATH + '/raw.json')));
        const formatted = prettier.format(raw, {parser : 'json'});

        fs.writeFileSync(ROOT_PATH + '/formatted.json', formatted, {encoding:'utf-8'});
    })
})