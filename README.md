# vscode-micromamba 

[![Build Status](https://github.com/mamba-org/vscode-micromamba/workflows/ci/badge.svg?branch=main)](https://github.com/mamba-org/vscode-micromamba/tree/main) [![Coverage Status](https://coveralls.io/repos/github/mamba-org/vscode-micromamba/badge.svg?branch=main)](https://coveralls.io/github/mamba-org/vscode-micromamba?branch=main) [![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/corker.vscode-micromamba?color=success&label=Visual%20Studio%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba) 

---


Content
- [vscode-micromamba](#vscode-micromamba)
  - [The Aim](#the-aim)
  - [Commands](#commands)
  - [How to get it?](#how-to-get-it)
  - [Maintainers](#maintainers)
  - [Want to Contribute?](#want-to-contribute)
  - [License](#license)

---

## The Aim

Provide a convenient way to install developer tools in VSCode workspaces from [conda-forge](https://conda-forge.org) with [micromamba](https://mamba.readthedocs.io). Get NodeJS, Go, Rust, Python or JupyterLab installed by running a single command.


Inspired by [Robocorp](https://robocorp.com) RPA developer tools:
 - [RCC](https://robocorp.com/docs/rcc/overview) - a command-line tool to run software robots and integrate with the Robocorp Cloud
 - [Robocorp Lab](https://robocorp.com/docs/developer-tools/robocorp-lab/overview) - a JupyterLab based IDE to build software robots
 - [Robocorp Code](https://robocorp.com/docs/developer-tools/visual-studio-code/overview) - a VSCode extension to build software robots

## Commands

### Micromamba: create environment

This command creates a file - environment.yml describing configuration.
The environment.yml is a [mamba environment file](https://mamba.readthedocs.io/en/latest/micromamba.html#yaml-environment-files)
The extension comes with a number of templates but you could change it to your needs and re-run init command.

1. Open command palette (Ctrl+Shift+P)
2. Type - micromamba create environment
3. Choose a template from a list
4. See the micromamba execution progress in terminal
5. The environment is activated automatically

### Micromamba: deactivate environment

1. Open command palette (Ctrl+Shift+P)
2. Type - micromamba deactivate environment
3. See the micromamba execution progress in terminal

### Micromamba: activate environment

1. Open command palette (Ctrl+Shift+P)
2. Type - micromamba activate environment
3. Choose an environment from a list of created environments
4. See the micromamba execution progress in terminal

### Micromamba: remove environment

1. Open command palette (Ctrl+Shift+P)
2. Type - micromamba remove environment
3. Choose an environment from a list of created environments
4. See the micromamba execution progress in terminal

### Micromamba: clear all

Clear all command removes micromamba, packages, and reset environment to the initial state.

1. Open command palette (Ctrl+Shift+P)
2. Type - micromamba clear all
3. See the micromamba execution progress in terminal

### DotEnv file support

DotEnv file is a convenient way to provide environment variables to other extensions or user scripts.
Each time user creates or activates an environment there is a ~/.micromamba/.env.{prefix-name} file created.

## How to get it?

Simply open [Micromamba - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba) and click "Install".
Alternatively open Visual Studio Code, go to the extension view and search for "Micromamba".
 
For detailed releases and migration help, please see [releases](https://github.com/mamba-org/vscode-micromamba/releases).


## Maintainers

Michael Borisov ([@corker](https://github.com/corker)).

## Want to Contribute?

Thanks for considering! Check [here](CONTRIBUTING.md) for useful tips and guidelines.

### License

We use a shared copyright model that enables all contributors to maintain the copyright on their contributions.

This software is licensed under the BSD-3-Clause license. See the [LICENSE](LICENSE) file for details.
