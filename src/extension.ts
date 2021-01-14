import * as vscode from 'vscode';

import { extensionName } from './appGlobals';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionName}.apply`, () => {
      /* noop */
    })
  );
}

export function deactivate(): void {
  /* noop */
}
