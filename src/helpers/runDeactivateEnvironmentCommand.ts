import { ExtensionContext } from './makeExtensionContext';
import * as vscode from 'vscode';
import { deactivateMicromambaEnvironment } from './activateMicromambaEnvironment';

export const runDeactivateEnvironmentCommand = async (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> => {
  deactivateMicromambaEnvironment(context, extContext);
};
