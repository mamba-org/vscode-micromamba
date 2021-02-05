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

export type MicromambaEnvironmentFileContent = {
  readonly name: string;
  readonly channels: string[];
  readonly dependencies: string[];
};

export type MicromambaEnvironmentFile = {
  readonly fileName: string;
  readonly filePath: string;
  readonly content: MicromambaEnvironmentFileContent;
};

export const readMicromambaEnvironmentFile = async (
  extContext: ExtensionContext,
  fileName: string
): Promise<MicromambaEnvironmentFile | undefined> => {
  const filePath = join(extContext.rootDir, fileName);
  try {
    const contentYaml = await fs.promises.readFile(filePath, 'utf8');
    const content = YAML.parse(contentYaml) as MicromambaEnvironmentFileContent;
    return { content, fileName, filePath };
  } catch (ignore) {
    return undefined;
  }
};

export const readMicromambaEnvironmentFiles = async (
  extContext: ExtensionContext
): Promise<MicromambaEnvironmentFile[]> => {
  const fileNames = sh
    .ls(extContext.rootDir)
    .filter((x) => x === defaultFileName || x.toLowerCase().startsWith('environment'))
    .filter((x) => x.endsWith('.yml') || x.endsWith('.yaml'));
  const promises = fileNames.map((x) => readMicromambaEnvironmentFile(extContext, x));
  const environmentFiles = await Promise.all(promises);
  return environmentFiles.filter((x) => !!x);
};

export const pickMicromambaEnvironmentFile = async (
  extContext: ExtensionContext
): Promise<MicromambaEnvironmentFile | undefined> => {
  const files = await readMicromambaEnvironmentFiles(extContext);
  switch (files.length) {
    case 0: {
      const placeHolder = 'Select an environment template';
      const key = await vscode.window.showQuickPick(Object.keys(templates), { placeHolder });
      if (key) {
        const content = templates[key];
        const environmentFilePath = join(extContext.rootDir, defaultFileName);
        sh.ShellString(content).to(environmentFilePath);
        return await readMicromambaEnvironmentFile(extContext, defaultFileName);
      }
      return undefined;
    }
    case 1:
      return files[0];
    default: {
      const placeHolder = 'Select an environment file';
      const items = files.map((data) => ({
        label: data.fileName,
        description: `[${data.content.name}]`,
        data,
      }));
      const item = await vscode.window.showQuickPick(items, { placeHolder });
      return item ? item.data : undefined;
    }
  }
};
