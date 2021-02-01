import * as vscode from 'vscode';
import * as path from 'path';

export type ExtensionContext = {
  rootDir: string;
  micromambaDir: string;
  micromambaPath: string;
};

export const makeExtensionContext = (): ExtensionContext => {
  if (vscode.workspace.workspaceFolders) {
    const rootDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const micromambaDir = path.join(rootDir, '.micromamba');
    const micromambaPath = path.join(
      micromambaDir,
      process.platform === 'win32' ? 'micromamba.exe' : 'micromamba'
    );
    return { rootDir, micromambaDir, micromambaPath };
  } else {
    return undefined;
  }
};
