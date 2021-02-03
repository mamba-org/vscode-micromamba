import * as vscode from 'vscode';
import {
  deactivateMicromambaEnvironment,
  restoreMicromambaEnvironment,
} from './activateMicromambaEnvironment';
import { isMicromambaInstalled } from './isMicromambaInstalled';
import { ExtensionContext } from './makeExtensionContext';

export const onActivate = async (
  context: vscode.ExtensionContext,
  extContext?: ExtensionContext
): Promise<void> => {
  if (extContext) {
    if (isMicromambaInstalled(extContext.micromambaDir)) {
      restoreMicromambaEnvironment(context, extContext);
    } else {
      deactivateMicromambaEnvironment(context, extContext);
    }
  } else {
    context.environmentVariableCollection.clear();
  }
};
