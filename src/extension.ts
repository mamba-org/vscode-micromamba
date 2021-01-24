import * as path from 'path';
import * as vscode from 'vscode';
import * as sh from 'shelljs';

import { extensionName } from './appGlobals';
import {
  ensureMicromamba,
  ensureMicromambaYamlFile,
  getMicromambaEnvVariables,
  makeMicromambaInitTask,
} from './helpers';

const state = {
  runningTaskCount: 0,
};

type ExtensionContext = {
  rootDir: string;
  micromambaDir: string;
  micromambaPath: string;
  micromambaYamlPath: string;
};

const lock = async (action: () => Promise<void>): Promise<void> => {
  if (state.runningTaskCount) {
    vscode.window.showInformationMessage('Another micromamba command is running');
    return;
  }
  state.runningTaskCount++;
  try {
    await action();
    state.runningTaskCount--;
  } catch (err) {
    state.runningTaskCount--;
    vscode.window.showErrorMessage('Failed to run micromamba command');
    throw err;
  }
};

const makeExtensionContext = (): ExtensionContext => {
  if (vscode.workspace.workspaceFolders) {
    const rootDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const micromambaDir = path.join(rootDir, '.micromamba');
    const micromambaPath = path.join(
      micromambaDir,
      process.platform === 'win32' ? 'micromamba.exe' : 'micromamba'
    );
    const micromambaYamlPath = path.join(rootDir, 'micromamba.yaml');
    return { rootDir, micromambaDir, micromambaPath, micromambaYamlPath };
  } else {
    return undefined;
  }
};

const runInitCommand = async (
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
    await ensureMicromamba(extContext.micromambaDir);
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't download micromamba`);
    return;
  }
  try {
    const ok = await ensureMicromambaYamlFile(extContext);
    if (!ok) return;
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't generate micromamba requirement file`);
    return;
  }
  const task = makeMicromambaInitTask(extContext);
  try {
    const value = await vscode.tasks.executeTask(task);
    return new Promise<void>((resolve) => {
      const d = vscode.tasks.onDidEndTask((e) => {
        if (e.execution != value) return;
        try {
          const envs = getMicromambaEnvVariables(extContext);
          envs.forEach((x) => context.environmentVariableCollection.replace(x.name, x.value));
        } catch (ignore) {
          vscode.window.showErrorMessage(`Can't activate micromamba`);
        }
        d.dispose();
        resolve();
      });
    });
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't initialize micromamba`);
  }
};

const runRefreshCommand = (
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

export function activate(context: vscode.ExtensionContext): void {
  sh.config.fatal = true;
  sh.config.silent = false;
  sh.config.verbose = true;
  const extContext = makeExtensionContext();
  if (extContext) {
    context.environmentVariableCollection.prepend(
      'PATH',
      `${extContext.micromambaDir}${path.delimiter}`
    );
    context.environmentVariableCollection.replace('MAMBA_ROOT_PREFIX', extContext.micromambaDir);
    context.environmentVariableCollection.replace('MAMBA_EXE', extContext.micromambaPath);
  }
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionName}.init`, async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Open a folder or a workspace');
        return;
      }
      lock(() => runInitCommand(context, extContext));
    }),
    vscode.commands.registerCommand(`${extensionName}.refresh`, async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Open a folder or a workspace');
        return;
      }
      lock(() => runRefreshCommand(context, extContext));
    })
  );
}

export function deactivate(): void {
  /* noop */
}
