import * as vscode from 'vscode';
import * as path from 'path';
import * as sh from 'shelljs';
import * as rimraf from 'rimraf';
import { ExtensionContext } from './makeExtensionContext';
import { deactivateMicromambaEnvironment } from './activateMicromambaEnvironment';
import { refreshContextFlags } from './refreshContextFlags';

export const runClearAllCommand = (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> => {
  deactivateMicromambaEnvironment(context, extContext);
  const { micromambaDir } = extContext;
  const tempDir = `${micromambaDir}_temp`;
  const targetDir = path.join(tempDir, `${Date.now()}`);
  try {
    sh.mkdir('-p', targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't create directory: ${targetDir}`);
    return Promise.resolve();
  }
  try {
    if (sh.test('-d', micromambaDir)) sh.mv(micromambaDir, targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't move directory: ${micromambaDir}`);
    return Promise.resolve();
  }
  refreshContextFlags(context, extContext);
  return vscode.window.withProgress(
    {
      title: 'Micromamba',
      location: vscode.ProgressLocation.Notification,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Deleting micromamba files' });
      try {
        await new Promise<void>((resolve, reject) =>
          rimraf(tempDir, (error) => {
            if (error) reject(error);
            else resolve();
          })
        );
      } catch (ignore) {
        vscode.window.showErrorMessage(`Can't clear files in: ${tempDir}`);
      }
    }
  ) as Promise<void>;
};
