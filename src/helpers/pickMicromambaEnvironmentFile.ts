import { join } from 'path';
import * as vscode from 'vscode';
import * as sh from 'shelljs';
import { isWindows } from './infra';
import { ExtensionContext } from './makeExtensionContext';
import * as fs from 'fs';
import * as YAML from 'yaml';

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

const dotnet = `
# This is a default micromamba configuration file

name: default

channels:
  - conda-forge

dependencies:
  - dotnet
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

const templates = isWindows
  ? {
      nodejs,
      go,
      rust,
      python,
      dotnet,
      jupyterlab,
    }
  : {
      nodejs,
      go,
      rust,
      python,
      jupyterlab,
    };

const defaultFileName = 'environment.yml';

export type MicromambaEnvironment = {
  readonly name: string;
  readonly dependencies: string[];
};

export const readMicromambaEnvironmentFromFile = async (
  extContext: ExtensionContext,
  environmentFileName: string
): Promise<MicromambaEnvironment> => {
  const environmentFilePath = join(extContext.rootDir, environmentFileName);
  try {
    const content = await fs.promises.readFile(environmentFilePath, 'utf8');
    return YAML.parse(content);
  } catch (ignore) {
    return undefined;
  }
};

export const pickMicromambaEnvironmentFile = async (
  extContext: ExtensionContext
): Promise<string | undefined> => {
  const fileNames = sh
    .ls(extContext.rootDir)
    .filter(
      (x) => x === defaultFileName || x.startsWith('environment.') || x.startsWith('environment-')
    )
    .filter((x) => x.endsWith('.yml') || x.endsWith('.yaml'));
  switch (fileNames.length) {
    case 0: {
      const key = await vscode.window.showQuickPick(Object.keys(templates));
      if (key) {
        const content = templates[key];
        const environmentFilePath = join(extContext.rootDir, defaultFileName);
        sh.ShellString(content).to(environmentFilePath);
        return environmentFilePath;
      }
      return undefined;
    }
    case 1:
      return fileNames[0];
    default: {
      const fileName = await vscode.window.showQuickPick(fileNames);
      if (fileName) return join(extContext.rootDir, fileName);
      return undefined;
    }
  }
};
