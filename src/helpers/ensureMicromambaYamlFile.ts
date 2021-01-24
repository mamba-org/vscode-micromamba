import * as vscode from 'vscode';
import * as sh from 'shelljs';

const nodejs = `
# This is a default micromamba configuration file

name: default

channels:
  - conda-forge

dependencies:
  - nodejs
`;

const go = `
# This is a default micromamba configuration file

name: default

channels:
  - conda-forge

dependencies:
  - go
`;

const rust = `
# This is a default micromamba configuration file

name: default

channels:
  - conda-forge

dependencies:
  - rust
`;

const python = `
# This is a default micromamba configuration file

name: default

channels:
  - conda-forge

dependencies:
  - python
`;

const jupyterlab = `
# This is a default micromamba configuration file

name: default

channels:
  - conda-forge

dependencies:
  - jupyter-packaging
  - jupyterlab
  - nodejs
  - pytest
  - pytest-check-links
  - python
  - yarn
`;

const templates = {
  nodejs,
  go,
  rust,
  python,
  jupyterlab,
};

export const ensureMicromambaYamlFile = async (options: {
  micromambaYamlPath: string;
}): Promise<boolean> => {
  if (sh.test('-e', options.micromambaYamlPath)) return true;
  const key = await vscode.window.showQuickPick(Object.keys(templates));
  if (key) {
    const content = templates[key];
    sh.ShellString(content).to(options.micromambaYamlPath);
    return true;
  }
  return false;
};
