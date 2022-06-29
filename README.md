# git-commit-msg-validator
This is simple git commit message validator.

# Feature
You can force git commit message format with this.<br/>
There are two modes.

1. Types Mode <br/>
Using types mode, commit message format of your project is forced like [{TYPE}] {TITLE} : {DESCRIPTION}.</br>
You can insert your own types in package.json using CLI.

2. Regular Expression Mode <br/>
Using regular expression mode, commit messages of your project are tested by regular expression you insert.

# Usage
First, you add package into your project.
```sh
$yarn add git-commit-msg-validator
```

Then, add **"git-commit-msg-validator"** to scripts > postinstall in your package.json.
```json
{
  "name": "test",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "postinstall": "git-commit-msg-validator"
  },
  "dependencies": {
    "git-commit-msg-validator": "^1.0.2"
  }
}
```

Then, **yarn** again
```sh
$yarn
```

![image](https://user-images.githubusercontent.com/49009864/176138559-89f5ff6b-2094-4363-848b-538f4c8c27e6.png)

Select mode what you will use. <br/>
And enter types what you want to use.

That's it, Entered types are inserted into package.json automatically.
```json
{
  "name": "test",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "postinstall": "git-commit-msg-validator"
  },
  "dependencies": {
    "git-commit-msg-validator": "^1.0.2"
  },
  "git-commit-msg-validator": "[\"new-feature\", \"fix-bug\", \"update\", \"modify\"]"
}
```

After, git hooks registered.
Test your commit messages.

```sh
$git add .
$git commit -m "commit test" // You will see error.

$git commit -m "[fix-bug] fix bugs text input : fix no response bugs in input component." 
// The fix has been committed.
```

# License 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Copyright (c) 2022 이형준

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
