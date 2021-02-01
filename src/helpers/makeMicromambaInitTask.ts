import * as vscode from 'vscode';

export const getMicromambaCreateArgs = (options: { filePath: string }): string[] => [
  'create',
  '--file',
  options.filePath,
  '--ssl_verify',
  'FALSE',
  '--yes',
];

export const makeMicromambaInitTask = (options: { filePath: string }): vscode.Task =>
  new vscode.Task(
    { type: 'micromamba' },
    vscode.workspace.workspaceFolders[0],
    'init',
    'micromamba',
    new vscode.ShellExecution('micromamba', getMicromambaCreateArgs(options))
  );
