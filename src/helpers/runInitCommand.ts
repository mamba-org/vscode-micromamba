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
  const filePath = await ensureMicromambaYamlFile(extContext);
  try {
    await vscode.window.withProgress(
      {
        title: 'Micromamba',
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Downloading micromamba' });
        await ensureMicromamba(extContext.micromambaDir);
      }
    );
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't download micromamba`);
    return;
  }
  const task = makeMicromambaInitTask({ filePath });
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
