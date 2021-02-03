import { ExtensionContext } from './makeExtensionContext';
import * as vscode from 'vscode';
import * as sh from 'shelljs';
import { join } from 'path';

export const pickMicromambaEnvironmentPrefixName = async (
  extContext: ExtensionContext
): Promise<string> => {
  const envsPath = join(extContext.micromambaDir, 'envs');
  if (!sh.test('-d', envsPath)) return undefined;
  const prefixNames = sh.ls(envsPath);
  switch (prefixNames.length) {
    case 0:
      return undefined;
    case 1:
      return prefixNames[0];
    default:
      return vscode.window.showQuickPick(prefixNames);
  }
};
