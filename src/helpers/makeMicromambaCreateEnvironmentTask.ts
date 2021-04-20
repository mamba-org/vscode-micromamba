import * as vscode from 'vscode';

export const getMicromambaCreateEnvironmentArgs = (environmentFileName: string): string[] => [
  'create',
  '--file',
  environmentFileName,
  '--yes',
];

export const makeMicromambaCreateEnvironmentTask = (
  environmentFileName: string,
  workspaceFolder: vscode.WorkspaceFolder
): vscode.Task =>
  new vscode.Task(
    { type: 'micromamba' },
    workspaceFolder,
    'create environment',
    'micromamba',
    new vscode.ShellExecution('micromamba', getMicromambaCreateEnvironmentArgs(environmentFileName))
  );
