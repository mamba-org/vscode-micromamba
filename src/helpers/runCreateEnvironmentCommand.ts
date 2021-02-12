import * as vscode from 'vscode';
import { ExtensionContext } from './makeExtensionContext';
import * as sh from 'shelljs';
import {
  MicromambaEnvironmentFile,
  pickMicromambaEnvironmentFile,
} from './pickMicromambaEnvironmentFile';
import { ensureMicromamba } from './ensureMicromamba';
import { makeMicromambaCreateEnvironmentTask } from './makeMicromambaCreateEnvironmentTask';
import {
  activateMicromambaEnvironment,
  deactivateMicromambaEnvironment,
} from './activateMicromambaEnvironment';
import { join } from 'path';

const _ensureMicromambaDir = (extContext: ExtensionContext): void => {
  try {
    sh.mkdir('-p', extContext.micromambaDir);
    const gitIgnorePath = join(extContext.micromambaDir, '.gitignore');
    if (!sh.test('-f', gitIgnorePath)) sh.ShellString('*').to(gitIgnorePath);
  } catch (ignore) {
    throw new Error(`Can't create directory: ${extContext.micromambaDir}`);
  }
};

const _ensureMicromamba = async (extContext: ExtensionContext): Promise<void> => {
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
    throw new Error(`Can't download micromamba`);
  }
};

const _createEnvironment = async (environmentFile: MicromambaEnvironmentFile): Promise<void> => {
  try {
    const task = makeMicromambaCreateEnvironmentTask(environmentFile.fileName);
    const value = await vscode.tasks.executeTask(task);
    await new Promise<void>((resolve) => {
      const d = vscode.tasks.onDidEndTask((e) => {
        if (e.execution != value) return;
        d.dispose();
        resolve();
      });
    });
  } catch (ignore) {
    throw new Error(`Can't initialize micromamba`);
  }
};

export const runCreateEnvironmentCommand = async (
  context: vscode.ExtensionContext,
  extContext: ExtensionContext
): Promise<void> => {
  try {
    deactivateMicromambaEnvironment(context, extContext);
    _ensureMicromambaDir(extContext);
    const environmentFile = await pickMicromambaEnvironmentFile(extContext);
    if (!environmentFile) return;
    await _ensureMicromamba(extContext);
    await _createEnvironment(environmentFile);
    activateMicromambaEnvironment(context, extContext, environmentFile.content.name);
  } catch (error) {
    const message = error.message || `Can't create micromamba environment`;
    vscode.window.showErrorMessage(message);
  }
};
