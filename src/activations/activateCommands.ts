import { Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import * as vscode from 'vscode';
import { CommandLike, commands } from '../commands';
import { ActiveEnvironmentManager, DisposableLike, ExtensionContext } from '../_definitions';

export const activateCommands = (
  extContext: ExtensionContext,
  manager: ActiveEnvironmentManager
): DisposableLike => {
  const commands$ = new Observable<CommandLike>((subscriber) => {
    const dis = vscode.Disposable.from(
      ...commands.map(([key, command]) =>
        vscode.commands.registerCommand(key, () => subscriber.next(command))
      )
    );
    return () => {
      dis.dispose();
    };
  });
  const sub = commands$
    .pipe(exhaustMap((x: CommandLike) => x({ extContext, manager })))
    .subscribe();
  return { dispose: () => sub.unsubscribe() };
};
