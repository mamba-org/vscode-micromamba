import * as vscode from 'vscode';
import * as sh from 'shelljs';

import { extensionName } from './appGlobals';
import {
  lock,
  makeExtensionContext,
  onActivate,
  runInitCommand,
  runRefreshCommand,
} from './helpers';

export function activate(context: vscode.ExtensionContext): void {
  sh.config.fatal = true;
  sh.config.silent = true;
  sh.config.verbose = false;
  const extContext = makeExtensionContext();
  if (extContext) {
    lock(() => onActivate(context, extContext));
  }
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionName}.init`, async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Open a folder or a workspace');
        return;
      }
      await lock(() => runInitCommand(context, extContext));
    }),
    vscode.commands.registerCommand(`${extensionName}.refresh`, async () => {
      if (!extContext) {
        vscode.window.showInformationMessage('Open a folder or a workspace');
        return;
      }
      await lock(() => runRefreshCommand(context, extContext));
    })
  );
}

export function deactivate(): void {
  /* noop */
}
