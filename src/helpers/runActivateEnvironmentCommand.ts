import { ExtensionContext } from './makeExtensionContext';
import * as vscode from 'vscode';
import { activateMicromambaEnvironment } from './activateMicromambaEnvironment';
import { pickMicromambaEnvironmentPrefixName } from './pickMicromambaEnvironmentPrefixName';
import { refreshContextFlags } from './refreshContextFlags';

export const runActivateEnvironmentCommand = async (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> => {
  const prefixName = await pickMicromambaEnvironmentPrefixName(
    extContext,
    'Select environment to activate'
  );
  if (!prefixName) return;
  activateMicromambaEnvironment(context, extContext, prefixName);
  refreshContextFlags(context, extContext);
};
