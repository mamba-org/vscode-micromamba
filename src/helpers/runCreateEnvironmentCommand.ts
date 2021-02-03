import * as vscode from 'vscode';
import { ExtensionContext } from './makeExtensionContext';
import * as sh from 'shelljs';
import {
  pickMicromambaEnvironmentFile,
  readMicromambaEnvironmentFromFile,
} from './pickMicromambaEnvironmentFile';
import { ensureMicromamba } from './ensureMicromamba';
import { makeMicromambaCreateEnvironmentTask } from './makeMicromambaCreateEnvironmentTask';
import {
  activateMicromambaEnvironment,
  deactivateMicromambaEnvironment,
} from './activateMicromambaEnvironment';

const _ensureMicromambaDir = (extContext: ExtensionContext): void => {
  try {
    sh.mkdir('-p', extContext.micromambaDir);
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

const _createEnvironment = async (environmentFileName: string): Promise<void> => {
  try {
    const task = makeMicromambaCreateEnvironmentTask(environmentFileName);
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
    const environmentFileName = await pickMicromambaEnvironmentFile(extContext);
    await _ensureMicromamba(extContext);
    await _createEnvironment(environmentFileName);
    const environment = await readMicromambaEnvironmentFromFile(extContext, environmentFileName);
    activateMicromambaEnvironment(context, extContext, environment.name);
  } catch (error) {
    const message = error.message || `Can't create micromamba environment`;
    vscode.window.showErrorMessage(message);
  }
};
