import * as path from 'path';
import * as vscode from 'vscode';
import * as sh from 'shelljs';

import { extensionName } from './appGlobals';
import { ensureMicromamba } from './micromamba';
import { execSync } from 'child_process';

const micromambaYamlContent = `
# This is a default micromamba configuration file

name: default

channels:
  - conda-forge

dependencies:
  - nodejs
`;

const state = {
  envMakeCount: 0,
};

export function activate(context: vscode.ExtensionContext): void {
  sh.config.fatal = true;
  sh.config.silent = false;
  sh.config.verbose = true;
  const extContext = (() => {
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
  })();
  if (extContext) {
    context.environmentVariableCollection.prepend(
      'PATH',
      `${extContext.micromambaDir}${path.delimiter}`
    );
    context.environmentVariableCollection.replace('MAMBA_ROOT_PREFIX', extContext.micromambaDir);
    context.environmentVariableCollection.replace('MAMBA_EXE', extContext.micromambaPath);
  }
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionName}.make.default.env`, async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Please open a folder or a workspace');
        return;
      }
      if (state.envMakeCount) return;
      state.envMakeCount++;
      sh.mkdir('-p', extContext.micromambaDir);
      await ensureMicromamba(extContext.micromambaDir);
      if (!sh.test('-e', extContext.micromambaYamlPath)) {
        sh.ShellString(micromambaYamlContent).to(extContext.micromambaYamlPath);
      }
      // const channel = vscode.window.createOutputChannel('micromamba');
      const args = [
        'create',
        '--file',
        extContext.micromambaYamlPath,
        '--ssl_verify',
        'FALSE',
        '--yes',
      ];
      const shellExecution = new vscode.ShellExecution('micromamba', args);
      // const shellExecution = new vscode.ShellExecution('env')
      const task = new vscode.Task(
        { type: 'micromamba' },
        vscode.workspace.workspaceFolders[0],
        'make',
        'micromamba',
        shellExecution
      );
      vscode.tasks.executeTask(task).then(
        (value) => {
          const d = vscode.tasks.onDidEndTask((e) => {
            if (e.execution != value) return;
            const pathKey = Object.keys(process.env).find((x) => x.toUpperCase() === 'PATH');
            const pathValue = process.env[pathKey];
            try {
              const envs = execSync('micromamba shell activate -s bash -p default', {
                encoding: 'utf-8',
                env: {
                  PATH: [extContext.micromambaDir, pathValue].join(path.delimiter),
                  MAMBA_ROOT_PREFIX: extContext.micromambaDir,
                  MAMBA_EXE: extContext.micromambaPath,
                },
              })
                .split('\r\n')
                .join('\n')
                .split('\n')
                .filter((x) => x.startsWith('export '))
                .map((x) => x.replace('export ', ''))
                .map((x) => x.split('='))
                .map((x) => {
                  const name = x[0];
                  const value = x[1].slice(1, -1);
                  return { name, value };
                });
              envs.forEach((x) => context.environmentVariableCollection.replace(x.name, x.value));
            } catch (ex) {
              console.log(ex);
            }
            vscode.window.showInformationMessage('Micromamba environment completed.');
            state.envMakeCount--;
            d.dispose();
          });
        },
        () => {
          vscode.window.showErrorMessage('Micromamba environment failed.');
          state.envMakeCount--;
        }
      );
    })
  );
}

export function deactivate(): void {
  /* noop */
}
