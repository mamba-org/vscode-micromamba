import * as vscode from 'vscode';

import { configureShellJS } from './helpers/configureShellJS';
import { makeActiveEnvironmentManager } from './environments/makeActiveEnvironmentManager';
import { makeExtensionContext } from './helpers/makeExtensionContext';
import {
  activateCommands,
  activateContextFlags,
  activateDotEnvFile,
  activateStatusBarItem,
  activateTerminal,
  activateWorkspaceState,
} from './activations';
import { makeEnvironmentInfo } from './environments/makeEnvironmentInfo';
import { activateProcessEnv } from './activations/activateProcessEnv';

export function activate(context: vscode.ExtensionContext): void {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage('micromamba: Open a folder or a workspace');
    return;
  }
  const extContext = makeExtensionContext(vscode.workspace.workspaceFolders[0]);
  configureShellJS(extContext);
  const manager = makeActiveEnvironmentManager();
  const info$ = makeEnvironmentInfo(extContext, manager);
  context.subscriptions.push(
    activateCommands(extContext, manager),
    activateStatusBarItem(manager),
    activateDotEnvFile(extContext, info$),
    activateTerminal(context, extContext, info$),
    activateProcessEnv(extContext, info$),
    activateContextFlags(extContext, info$),
    activateWorkspaceState(context, manager)
  );
}

export function deactivate(): void {
  /* noop */
}
