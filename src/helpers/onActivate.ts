import * as vscode from 'vscode';
import { activateMicromamba } from './activateMicromamba';
import { isMicromambaInstalled } from './isMicromambaInstalled';
import { ExtensionContext } from './makeExtensionContext';
import { resetEnvironmentVariables } from './resetEnvironmentVariables';

export const onActivate = async (
  context: vscode.ExtensionContext,
  extContext?: ExtensionContext
): Promise<void> => {
  context.environmentVariableCollection.clear();
  if (!extContext) return;
  resetEnvironmentVariables(context, extContext);
  if (!isMicromambaInstalled(extContext.micromambaDir)) return;
  activateMicromamba(context, extContext);
};
