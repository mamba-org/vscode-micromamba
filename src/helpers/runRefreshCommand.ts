import * as vscode from 'vscode';
import * as path from 'path';
import * as sh from 'shelljs';
import { ExtensionContext } from './makeExtensionContext';
import { runInitCommand } from './runInitCommand';

export const runRefreshCommand = (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> => {
  const { micromambaDir } = extContext;
  const tempDir = path.join(micromambaDir, 'temp');
  const envsDir = path.join(micromambaDir, 'envs');
  const pkgsDir = path.join(micromambaDir, 'pkgs');
  const targetDir = path.join(tempDir, `${Date.now()}`);
  try {
    sh.mkdir('-p', targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't create directory: ${targetDir}`);
    return;
  }
  try {
    if (sh.test('-d', envsDir)) sh.mv(envsDir, targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't move directory: ${envsDir}`);
    return;
  }
  try {
    if (sh.test('-d', pkgsDir)) sh.mv(pkgsDir, targetDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't move directory: ${pkgsDir}`);
    return;
  }
  try {
    if (sh.test('-f', extContext.micromambaPath)) sh.rm(extContext.micromambaPath);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't remove file: ${extContext.micromambaPath}`);
    return;
  }
  runInitCommand(context, extContext).then();
  try {
    sh.rm('-rf', tempDir);
  } catch (ignore) {
    /* noop */
  }
};
