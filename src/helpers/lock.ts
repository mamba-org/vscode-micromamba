import * as vscode from 'vscode';
import { ExtensionContext } from './makeExtensionContext';
import { refreshContextFlags } from './refreshContextFlags';

const state = {
  runningTaskCount: 0,
};

export const lock = async (
  action: (context: vscode.ExtensionContext, extContext?: ExtensionContext) => Promise<void>,
  context: vscode.ExtensionContext,
  extContext?: ExtensionContext
): Promise<void> => {
  if (state.runningTaskCount) {
    vscode.window.showInformationMessage('Another micromamba command is running');
    return;
  }
  state.runningTaskCount++;
  try {
    await action(context, extContext);
    state.runningTaskCount--;
  } catch (err) {
    state.runningTaskCount--;
    vscode.window.showErrorMessage('Failed to run micromamba command');
    throw err;
  }
  refreshContextFlags(context, extContext);
};
