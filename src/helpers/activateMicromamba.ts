import * as vscode from 'vscode';
import { getMicromambaEnvVariables } from './getMicromambaEnvVariables';
import { ExtensionContext } from './makeExtensionContext';

export const activateMicromamba = (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): void => {
  try {
    const envs = getMicromambaEnvVariables(extContext);
    context.environmentVariableCollection.clear();
    envs.forEach((x) => context.environmentVariableCollection.replace(x.name, x.value));
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't activate micromamba`);
  }
};
