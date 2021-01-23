import * as vscode from 'vscode';

export const makeMicromambaInitTask = (options: { micromambaYamlPath: string }): vscode.Task =>
  new vscode.Task(
    { type: 'micromamba' },
    vscode.workspace.workspaceFolders[0],
    'init',
    'micromamba',
    new vscode.ShellExecution('micromamba', [
      'create',
      '--file',
      options.micromambaYamlPath,
      '--ssl_verify',
      'FALSE',
      '--yes',
    ])
  );
