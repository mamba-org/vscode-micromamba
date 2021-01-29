import * as vscode from 'vscode';
import { ExtensionContext } from './makeExtensionContext';
import { runInitCommand } from './runInitCommand';
import { runClearCommand } from './runClearCommand';

export const runRefreshCommand = async (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> => {
  const runClearCommandPromise = runClearCommand(context, extContext);
  if (runClearCommandPromise == undefined) return;
  await Promise.all([runClearCommandPromise, runInitCommand(context, extContext)]);
};
