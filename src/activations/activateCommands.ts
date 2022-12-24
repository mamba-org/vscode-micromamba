import { Observable } from 'rxjs'
import { exhaustMap } from 'rxjs/operators'
import * as vscode from 'vscode'
import { CommandLike, commands } from '../commands'
import { ActiveEnvironmentManager, DisposableLike, ExtensionContext } from '../_definitions'

async function askToReloadWindow(): Promise<void> {
  const action = 'Reload'
  const result = await vscode.window.showInformationMessage(
    'micromamba: Reload VSCode window to apply changes',
    action,
  )
  if (result === action) vscode.commands.executeCommand('workbench.action.reloadWindow')
}

export const activateCommands = (
  extContext: ExtensionContext,
  manager: ActiveEnvironmentManager,
): DisposableLike => {
  const commands$ = new Observable<CommandLike>((subscriber) => {
    const dis = vscode.Disposable.from(
      ...commands.map(([key, command]) =>
        vscode.commands.registerCommand(key, () => subscriber.next(command)),
      ),
    )
    return () => dis.dispose()
  })
  const sub = commands$
    .pipe(
      exhaustMap(async (x: CommandLike) => {
        await x({ extContext, manager })
        askToReloadWindow().then()
      }),
    )
    .subscribe()
  return { dispose: () => sub.unsubscribe() }
}
