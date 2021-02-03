import * as vscode from 'vscode';
import { getMicromambaEnvVariables } from './getMicromambaEnvVariables';
import { ExtensionContext } from './makeExtensionContext';
import * as path from 'path';
import { pathKey } from './infra';

const environmentNameStateKey = 'micromamba.active.environment.name';

export const deactivateMicromambaEnvironment = (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): void => {
  extContext.statusBarItem.text = `µenv<none>`;
  extContext.statusBarItem.show();
  context.workspaceState.update(environmentNameStateKey, undefined);
  const pathPrependValue = `${extContext.micromambaDir}${path.delimiter}`;
  context.environmentVariableCollection.clear();
  context.environmentVariableCollection.prepend(pathKey, pathPrependValue);
  context.environmentVariableCollection.replace('MAMBA_ROOT_PREFIX', extContext.micromambaDir);
  context.environmentVariableCollection.replace('MAMBA_EXE', extContext.micromambaPath);
};

export const restoreMicromambaEnvironment = (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): void => {
  const prefixName = context.workspaceState.get<string>(environmentNameStateKey);
  if (prefixName) {
    activateMicromambaEnvironment(context, extContext, prefixName);
  } else {
    deactivateMicromambaEnvironment(context, extContext);
  }
};

export const activateMicromambaEnvironment = (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext,
  prefixName: string
): void => {
  try {
    const envs = getMicromambaEnvVariables({ ...extContext, prefixName });
    context.environmentVariableCollection.clear();
    envs.forEach((x) => context.environmentVariableCollection.replace(x.name, x.value));
    context.workspaceState.update(environmentNameStateKey, prefixName);
    extContext.statusBarItem.text = `µenv[${prefixName}]`;
    extContext.statusBarItem.show();
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't activate micromamba`);
  }
};
