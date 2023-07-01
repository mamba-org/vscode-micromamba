# vscode-micromamba

[![Build Status](https://github.com/mamba-org/vscode-micromamba/workflows/ci/badge.svg?branch=main)](https://github.com/mamba-org/vscode-micromamba/tree/main) [![Coverage Status](https://coveralls.io/repos/github/mamba-org/vscode-micromamba/badge.svg?branch=main)](https://coveralls.io/github/mamba-org/vscode-micromamba?branch=main) [![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/corker.vscode-micromamba?color=success&label=Visual%20Studio%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba)

---

Content

- [vscode-micromamba](#vscode-micromamba)
  - [The Aim](#the-aim)
  - [Commands](#commands)
  - [Global home directory](#global-home-directory)
  - [DotEnv file support](#dotenv-file-support)
  - [Multi-root workspaces](#multi-root-workspaces)
  - [How to get it?](#how-to-get-it)
  - [Maintainers](#maintainers)
  - [Want to Contribute?](#want-to-contribute)
  - [License](#license)

---

## The Aim

Provide a convenient way to install developer tools in VSCode workspaces from [conda-forge](https://conda-forge.org) with [micromamba](https://mamba.readthedocs.io). Get NodeJS, Go, Rust, Python, or JupyterLab installed by running a single command.

Inspired by [Robocorp](https://robocorp.com) RPA developer tools:

- [RCC](https://robocorp.com/docs/rcc/overview) - a command-line tool to run software robots and integrate with the Robocorp Cloud
- [Robocorp Code](https://robocorp.com/docs/developer-tools/visual-studio-code/overview) - a VSCode extension to build software robots

## Commands

### Micromamba: create an environment

This command creates a file - environment.yml describing configuration.
The environment.yml is a [mamba environment file](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html#yaml-spec-files)
The extension comes with a number of templates, but you could change it to your needs and re-run the init command.

1. Open the command palette (Ctrl+Shift+P)
2. Type - micromamba create environment
3. Choose a template from a list
4. The environment is activated automatically

### Micromamba: deactivate the environment

1. Open the command palette (Ctrl+Shift+P)
2. Type - micromamba deactivate environment

### Micromamba: activate environment

1. Open the command palette (Ctrl+Shift+P)
2. Type - micromamba activate environment
3. Choose an environment from a list of created environments

### Micromamba: remove the environment

1. Open the command palette (Ctrl+Shift+P)
2. Type - micromamba remove environment
3. Choose an environment from a list of created environments

### Micromamba: clear all

Clear all command, removes micromamba and packages, and reset the environment to the initial state.

1. Open the command palette (Ctrl+Shift+P)
2. Type - micromamba clear all

### Micromamba: activate environment by path

Activate an environment created outside of the _vscode-micromamba_ extension.

1. Open the command palette (Ctrl+Shift+P)
2. type - micromamba activate by path

### Micromamba: use the global home directory

Store micromamba files and environments for all projects in one global directory.

1. Open the command palette (Ctrl+Shift+P)
2. Type - micromamba use global home directory

### Micromamba: use the local home directory

Store micromamba files and environments in the .micromamba directory inside the project.

1. Open the command palette (Ctrl+Shift+P)
2. Type - micromamba use local home directory

> This is a default behavior

### Micromamba: self-update

Update micromamba to the latest version.

1. Open the command palette (Ctrl+Shift+P)
2. Type - micromamba self update

> Micromamba updates each time before creating a new environment

### Micromamba: show output

Show output pane and select micromamba source

1. Open the command palette (Ctrl+Shift+P)
2. Type - micromamba show output

## Global home directory

The extension works locally by default when all additional files are created in the `<workspaceRoot>/.micromamba` directory.
Switching to global home directory mode is also possible when files for all projects are stored in one place.

### Local mode

1. A fully encapsulated installation per project - all files are inside the project directory
2. Nothing left behind when the project gets deleted
3. Easy to investigate the content of the micromamba environments

### Global mode

1. Use less disk space and could be faster to create environments because packages are cached globally
2. Micromamba files inside the project directory could conflict with other tools. E.g., `yarn` doesn't like local mode in combination with the `module` node package type.

### Location of the global home directory

On Linux and Mac, the global home directory is always `$HOME/.vscode-micromamba`

On Windows, the extension asks to provide a path to the global home directory.
It's recommended to make the path as short as possible to minimize [MAX_PATH problems](https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation?tabs=registry), especially when using Python.

## DotEnv file support

DotEnv file is a convenient way to provide environment variables to other extensions or user scripts.
Each time a user creates or activates an environment, a ~/.micromamba/.env.{prefix-name} file is created.

## Multi-root workspaces

With multi-root workspaces, all operations will work the same way as if you open the first workspace folder in VSCode.
The idea is that the first workspace folder is a target folder.

Let's say you have a ```project.code-workspace``` with content:

```json
{
  "folders": [
    {
      "path": "folderA"
    },
    {
      "path": "folderB"
    }
  ]
}
```

Assuming folders are already created, when you open the workspace in VSCode and command to create a micromamba environment, you'll see the following directory structure:

```text
.
├── folderA
│   ├── .micromamba
│   └── environment.yml
├── folderB
```

## How to get it?

Simply open [Micromamba - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba) and click _Install_.
Alternatively, open Visual Studio Code, go to the extension view and search for _Micromamba_.

For detailed releases and migration help, please see [releases](https://github.com/mamba-org/vscode-micromamba/releases).

## Maintainers

Michael Borisov ([@corker](https://github.com/corker)).

## Want to Contribute?

Thanks for considering! Check [here](CONTRIBUTING.md) for useful tips and guidelines.

### License

We use a shared copyright model that enables all contributors to maintain the copyright on their contributions.

This software is licensed under the BSD-3-Clause license. See the [LICENSE](LICENSE) file for details.
