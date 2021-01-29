import * as vscode from 'vscode';
import * as path from 'path';
import * as sh from 'shelljs';
import { ExtensionContext } from './makeExtensionContext';
import { resetEnvironmentVariables } from './resetEnvironmentVariables';

export const runClearCommand = (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> | undefined => {
  resetEnvironmentVariables(context, extContext);
  const { micromambaDir } = extContext;
  const tempDir = path.join(micromambaDir, 'temp');
  const envsDir = path.join(micromambaDir, 'envs');
  const pkgsDir = path.join(micromambaDir, 'pkgs');
  const targetDir = path.join(tempDir, `${Date.now()}`);
  try {
    sh.mkdir('-p', targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't create directory: ${targetDir}`);
    return undefined;
  }
  try {
    if (sh.test('-d', envsDir)) sh.mv(envsDir, targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't move directory: ${envsDir}`);
    return undefined;
  }
  try {
    if (sh.test('-d', pkgsDir)) sh.mv(pkgsDir, targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't move directory: ${pkgsDir}`);
    return undefined;
  }
  try {
    sh.ls(micromambaDir)
      .filter((x) => x !== 'temp')
      .forEach((x) => sh.mv(path.join(micromambaDir, x), targetDir));
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't move from: ${micromambaDir}`);
    return undefined;
  }
  try {
    if (sh.test('-f', extContext.micromambaPath)) sh.rm(extContext.micromambaPath);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't remove file: ${extContext.micromambaPath}`);
    return undefined;
  }
  return vscode.window.withProgress(
    {
      title: 'Micromamba',
      location: vscode.ProgressLocation.Notification,
      cancellable: false,
    },
    async (progress) => {
      await progress.report({ message: 'Deleting micromamba files' });
      try {
        sh.rm('-rf', tempDir);
      } catch (ignore) {
        vscode.window.showErrorMessage(`Can't clear files in: ${tempDir}`);
      }
    }
  ) as Promise<void>;
};
