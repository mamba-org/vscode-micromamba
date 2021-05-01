import * as vscode from 'vscode';
import { ActiveEnvironmentManager, DisposableLike } from '../_definitions';

export function activateStatusBarItem(manager: ActiveEnvironmentManager): DisposableLike {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  const sub = manager.prefix$.subscribe((name) => {
    if (name) statusBarItem.text = `µenv[${name}]`;
    else statusBarItem.text = `µenv<none>`;
    statusBarItem.show();
  });
  return vscode.Disposable.from(statusBarItem, { dispose: () => sub.unsubscribe() });
}
