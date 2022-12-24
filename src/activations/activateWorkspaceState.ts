import * as vscode from 'vscode'
import { skip } from 'rxjs/operators'
import { ActiveEnvironmentManager, ActiveEnvironmentPrefix, DisposableLike } from '../_definitions'

export function activateWorkspaceState(
  context: vscode.ExtensionContext,
  manager: ActiveEnvironmentManager,
): DisposableLike {
  const key = 'micromamba.active.environment.name'
  const { workspaceState } = context
  const prefix = workspaceState.get<ActiveEnvironmentPrefix>(key)
  if (prefix) manager.activate(prefix)
  else manager.deactivate()
  const sub = manager.prefix$
    .pipe(skip(1))
    .subscribe((x: ActiveEnvironmentPrefix) => workspaceState.update(key, x))
  return { dispose: (): void => sub.unsubscribe() }
}
