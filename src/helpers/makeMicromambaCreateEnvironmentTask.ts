import * as vscode from 'vscode';

export const getMicromambaCreateEnvironmentArgs = (environmentFileName: string): string[] => [
  'create',
  '--file',
  environmentFileName,
  '--yes',
];

export const makeMicromambaCreateEnvironmentTask = (environmentFileName: string): vscode.Task =>
  new vscode.Task(
    { type: 'micromamba' },
    vscode.workspace.workspaceFolders[0],
    'create environment',
    'micromamba',
    new vscode.ShellExecution('micromamba', getMicromambaCreateEnvironmentArgs(environmentFileName))
  );
