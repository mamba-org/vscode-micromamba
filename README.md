# vscode-micromamba 

[![Build Status](https://travis-ci.org/corker/vscode-micromamba.svg?branch=master)](https://travis-ci.org/corker/vscode-micromamba) [![Coverage Status](https://coveralls.io/repos/github/corker/vscode-micromamba/badge.svg?branch=master)](https://coveralls.io/github/corker/vscode-micromamba?branch=master) [![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/corker.vscode-micromamba?color=success&label=Visual%20Studio%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba) 

---


Content
- [vscode-micromamba](#vscode-micromamba)
  - [The Aim](#the-aim)
  - [Maintainers](#maintainers)
  - [Features](#features)
  - [How to get it?](#how-to-get-it)
  - [Want to Contribute?](#want-to-contribute)
  - [License](#license)

---

## The Aim

Quickly configure development tools in VSCode workspaces using conda-forge and micromamba.
Install and initialize NodeJS, Go, Rust, Python or JupyterLab from the command pallet.

## Maintainers

Michael Borisov ([@corker](https://github.com/corker)).

## Commands

### Micromamba: init

1. Open command pallet (ctrl+Shit+P)
2. Type - micromamba init
3. Choose a template from a list
4. See the micromamba execution progress in terminal

This command creates a file - micromamba.yaml describing configuration.
The micromamba.yaml is a [mamba requirement file](https://mamba.readthedocs.io/en/latest/micromamba.html#yaml-environment-files)
The extension comes with a number of templates but you could change it to your needs and re-run init command.

### Micromamba: refresh

1. Open command pallet (ctrl+Shit+P)
2. Type - micromamba refresh
4. See the micromamba execution progress in terminal

Refresh command removes micromamba, packages, and environment, and run init command to create a fresh environment.

## How to get it?

Simply open [Micromamba - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba) and click "Install".
Alternatively open Visual Studio Code, go to the extension view and search for "Micromamba".
 
For detailed releases and migration help, please see [releases](https://github.com/corker/vscode-micromamba/releases).


## Want to Contribute?

Thanks for considering! Check [here](CONTRIBUTING.md) for useful tips and guidelines.

## License

vscode-micromamba is [Apache2 licensed.](LICENSE)
