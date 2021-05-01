import * as vscode from 'vscode';
import * as sh from 'shelljs';
import { join } from 'path';
import { ExtensionContext } from '../_definitions';
import { CommandLike } from './_definitions';
import { ensureMicromamba, makeMicromambaCreateEnvironmentTask } from '../micromamba';
import { MicromambaEnvironmentFile, pickMicromambaEnvironmentFile } from '../environments';

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
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return Promise.resolve();
    const task = makeMicromambaCreateEnvironmentTask(environmentFile.fileName, workspaceFolder);
    const value = await vscode.tasks.executeTask(task);
    await new Promise<void>((resolve) => {
      const dis = vscode.tasks.onDidEndTask((e) => {
        if (e.execution != value) return;
        dis.dispose();
        resolve();
      });
    });
  } catch (ignore) {
    throw new Error(`Can't initialize micromamba`);
  }
};

export const runCreateEnvironmentCommand: CommandLike = async ({ extContext, manager }) => {
  try {
    manager.deactivate();
    const environmentFile = await pickMicromambaEnvironmentFile(extContext);
    if (!environmentFile) return;
    _ensureMicromambaDir(extContext);
    await _ensureMicromamba(extContext);
    await _createEnvironment(environmentFile);
    manager.activate(environmentFile.content.name);
  } catch (error) {
    const message = error.message || `Can't create micromamba environment`;
    vscode.window.showErrorMessage(message);
  }
};
