import * as path from 'path';
import * as vscode from 'vscode';
import { activateMicromamba } from './activateMicromamba';
import { isMicromambaInstalled } from './isMicromambaInstalled';
import { ExtensionContext } from './makeExtensionContext';

export const onActivate = async (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> => {
  context.environmentVariableCollection.prepend(
    'PATH',
    `${extContext.micromambaDir}${path.delimiter}`
  );
  context.environmentVariableCollection.replace('MAMBA_ROOT_PREFIX', extContext.micromambaDir);
  context.environmentVariableCollection.replace('MAMBA_EXE', extContext.micromambaPath);
  if (isMicromambaInstalled(extContext.micromambaDir)) activateMicromamba(context, extContext);
};
