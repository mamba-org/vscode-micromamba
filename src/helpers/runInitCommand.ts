import * as vscode from 'vscode';
import { ExtensionContext } from './makeExtensionContext';
import * as sh from 'shelljs';
import { ensureMicromambaYamlFile } from './ensureMicromambaYamlFile';
import { ensureMicromamba } from './ensureMicromamba';
import { makeMicromambaInitTask } from './makeMicromambaInitTask';
import { activateMicromamba } from './activateMicromamba';

export const runInitCommand = async (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> => {
  try {
    sh.mkdir('-p', extContext.micromambaDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't create directory: ${extContext.micromambaDir}`);
    return;
  }
  try {
    const ok = await ensureMicromambaYamlFile(extContext);
    if (!ok) return;
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't generate micromamba requirement file`);
    return;
  }
  try {
    await ensureMicromamba(extContext.micromambaDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't download micromamba`);
    return;
  }
  const task = makeMicromambaInitTask(extContext);
  try {
    const value = await vscode.tasks.executeTask(task);
    return new Promise<void>((resolve) => {
      const d = vscode.tasks.onDidEndTask((e) => {
        if (e.execution != value) return;
        activateMicromamba(context, extContext);
        d.dispose();
        resolve();
      });
    });
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't initialize micromamba`);
  }
};
