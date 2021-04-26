# Contributing

1. [Code of Conduct](#code_of_conduct): the standard open source contribution guideline.
1. [How to Contribute](#how_to_contribute): tips on how to setup your local vscode-micromamba development environment; as well as test and debug it before submission.

## Code of Conduct
We adopt the standard open source [contributor covenant](https://www.contributor-covenant.org/version/1/4/code-of-conduct.html). 

_(If you have contributed to any open source project before, you already knew it; otherwise, we recommend a quick read above.)_

## How to contribute

### Repository Setup

```js
git clone https://github.com/mamba-org/vscode-micromamba
cd vscode-micromamba
npm install
code .
```

### Testing and Debugging

**1. unit tests**
Make sure `npm run lint`, `npm run test` and `npm run vscode:prepublish` all work.

**2. integration tests**

There are two debugging launch configurations defined in `.vscode/launch.json`:
  * Debug Tests
  * Launch Extension

To debug the extension, [change the launch configuration](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations) to **Launch Extension** and start debugging.

**3. eat our own dog food**

The ultimate test is to actually use it in our real day-to-day working environment for a while. There are multiple ways to do this:
- by command line: `code --extensionDevelopmentPath=your-local-vscode-micromamba`
- by environment variable: `CODE_EXTENSIONS_PATH`
- by symlink:

  Here is a mac example:
  ```
  $ cd ~/.vscode/extensions
  $ mv corker.vscode-micromamba-2.7.0 vscode.orig
  $ ln -s corker.vscode-micromamba-2.7.0 your-local-vscode-micromamba
  ```
  restore vscode.orig when you are done testing.
