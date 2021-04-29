import * as vscode from 'vscode';
import * as sh from 'shelljs';

import {
  lock,
  makeExtensionContext,
  onActivate,
  runCreateEnvironmentCommand,
  runActivateEnvironmentCommand,
  runDeactivateEnvironmentCommand,
  runRemoveEnvironmentCommand,
  runClearAllCommand,
} from './helpers';

export function activate(context: vscode.ExtensionContext): void {
  sh.config.fatal = true;
  sh.config.silent = true;
  sh.config.verbose = false;
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  context.subscriptions.push(statusBarItem);
  const extContext = makeExtensionContext(statusBarItem);
  lock(onActivate, context, extContext).then();
  context.subscriptions.push(
    vscode.commands.registerCommand('corker.micromamba.create.environment', async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Open a folder or a workspace');
        return;
      }
      await lock(runCreateEnvironmentCommand, context, extContext);
    }),
    vscode.commands.registerCommand('corker.micromamba.activate.environment', async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Open a folder or a workspace');
        return;
      }
      await lock(runActivateEnvironmentCommand, context, extContext);
    }),
    vscode.commands.registerCommand('corker.micromamba.deactivate.environment', async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Open a folder or a workspace');
        return;
      }
      await lock(runDeactivateEnvironmentCommand, context, extContext);
    }),
    vscode.commands.registerCommand('corker.micromamba.remove.environment', async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Open a folder or a workspace');
        return;
      }
      await lock(runRemoveEnvironmentCommand, context, extContext);
    }),
    vscode.commands.registerCommand('corker.micromamba.clear.all', async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Open a folder or a workspace');
        return;
      }
      await lock(runClearAllCommand, context, extContext);
    })
  );
}

export function deactivate(): void {
  /* noop */
}
