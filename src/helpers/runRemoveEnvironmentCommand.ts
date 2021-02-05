import { ExtensionContext } from './makeExtensionContext';
import * as vscode from 'vscode';
import { join } from 'path';
import * as sh from 'shelljs';
import * as rimraf from 'rimraf';
import { deactivateMicromambaEnvironment } from './activateMicromambaEnvironment';
import { pickMicromambaEnvironmentPrefixName } from './pickMicromambaEnvironmentPrefixName';

export const runRemoveEnvironmentCommand = async (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> => {
  const prefixName = await pickMicromambaEnvironmentPrefixName(
    extContext,
    'Select environment to remove'
  );
  if (!prefixName) return;
  deactivateMicromambaEnvironment(context, extContext);
  const { micromambaDir } = extContext;
  const tempDir = `${micromambaDir}_temp`;
  const targetDir = join(tempDir, `${Date.now()}`);
  const envDir = join(micromambaDir, 'envs', prefixName);
  try {
    sh.mkdir('-p', targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't create directory: ${targetDir}`);
    return;
  }
  try {
    if (sh.test('-d', envDir)) sh.mv(envDir, targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't move directory: ${envDir}`);
    return;
  }
  return vscode.window.withProgress(
    {
      title: 'Micromamba',
      location: vscode.ProgressLocation.Notification,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Deleting micromamba temp files' });
      try {
        await new Promise<void>((resolve, reject) =>
          rimraf(tempDir, (error) => {
            if (error) reject(error);
            else resolve();
          })
        );
      } catch (ignore) {
        vscode.window.showErrorMessage(`Can't delete files in: ${tempDir}`);
      }
    }
  ) as Promise<void>;
};
