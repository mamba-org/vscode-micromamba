import { Observable } from 'rxjs'
import { exhaustMap, withLatestFrom } from 'rxjs/operators'
import { CommandLike, commands as _commands } from '../commands'
import { Disposable, commands } from 'vscode'
import { EnvironmentInfo } from '../micromamba'

export const activateCommands = (
  info$: Observable<EnvironmentInfo>
) => {
  const commands$ = new Observable<CommandLike>((s) => {
    const dis = Disposable.from(
      ..._commands.map(([key, command]) => commands.registerCommand(key, () => s.next(command))),
    )
    return () => dis.dispose()
  })
  const sub = commands$
    .pipe(withLatestFrom(info$), exhaustMap(([x, info]) => x(info)))
    .subscribe()
  return { dispose: () => sub.unsubscribe() }
}
