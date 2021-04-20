import * as vscode from 'vscode';
import * as path from 'path';

export type ExtensionContext = {
  rootDir: string;
  micromambaDir: string;
  micromambaPath: string;
  statusBarItem: vscode.StatusBarItem;
};

export const makeExtensionContext = (
  statusBarItem: vscode.StatusBarItem
): ExtensionContext | undefined => {
  if (vscode.workspace.workspaceFolders) {
    const rootDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const micromambaDir = path.join(rootDir, '.micromamba');
    const micromambaPath = path.join(
      micromambaDir,
      process.platform === 'win32' ? 'micromamba.exe' : 'micromamba'
    );
    return { rootDir, micromambaDir, micromambaPath, statusBarItem };
  } else {
    return undefined;
  }
};
