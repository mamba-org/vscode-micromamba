import { ExtensionContext } from './makeExtensionContext';
import * as vscode from 'vscode';
import * as sh from 'shelljs';
import { join } from 'path';
import {
  readMicromambaEnvironmentFiles,
  MicromambaEnvironmentFile,
} from './pickMicromambaEnvironmentFile';

const _pickMicromambaEnvironmentPrefixName = async (
  files: MicromambaEnvironmentFile[],
  prefixNames: string[],
  placeHolder: string
): Promise<string | undefined> => {
  const items = files
    .filter((x) => prefixNames.find((p) => p === x.content.name))
    .map((data) => ({
      label: data.fileName,
      description: `[${data.content.name}]`,
      data,
    }));
  const item = await vscode.window.showQuickPick(items, { placeHolder });
  return item ? item.data.content.name : undefined;
};

export const pickMicromambaEnvironmentPrefixName = async (
  extContext: ExtensionContext,
  placeHolder: string
): Promise<string> => {
  const envsPath = join(extContext.micromambaDir, 'envs');
  if (!sh.test('-d', envsPath)) return undefined;
  const names = sh.ls(envsPath);
  const files = await readMicromambaEnvironmentFiles(extContext);
  switch (names.length) {
    case 0:
      return undefined;
    case 1:
      return files.length === 1
        ? names[0]
        : _pickMicromambaEnvironmentPrefixName(files, names, placeHolder);
    default: {
      return _pickMicromambaEnvironmentPrefixName(files, names, placeHolder);
    }
  }
};
