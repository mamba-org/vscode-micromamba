import * as path from 'path';
import * as vscode from 'vscode';
import { pathKey } from './infra';
import { ExtensionContext } from './makeExtensionContext';

export const resetEnvironmentVariables = (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): void => {
  const pathPrependValue = `${extContext.micromambaDir}${path.delimiter}`;
  context.environmentVariableCollection.clear();
  context.environmentVariableCollection.prepend(pathKey, pathPrependValue);
  context.environmentVariableCollection.replace('MAMBA_ROOT_PREFIX', extContext.micromambaDir);
  context.environmentVariableCollection.replace('MAMBA_EXE', extContext.micromambaPath);
};
