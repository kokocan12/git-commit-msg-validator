# git-commit-msg-validator
This is simple git commit message validator.

# Feature
You can force git commit message format using this.<br/>
There are two modes.

1. Types Mode
Using this mode, commit message format of your project is forced like [{TYPE}] {TITLE} : {DESCRIPTION}.</br>
You insert your own types in package.json using CLI.

2. Regular Expression Mode
Using Regular expression mode, commit message format of your project should be tested by regular expression you insert.

# Usage
First, you add package into your project.
```sh
$yarn add git-commit-msg-validator
```

Then, add **"git-commit-msg-validator"** to scripts > postinstall.
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

```sh
$git add .
$git commit -m "commit test"
```
