import * as vscode from 'vscode'
import * as path from 'path'
import { pathKey } from '../helpers/infra'
import { Observable } from 'rxjs'
import { DisposableLike, ExtensionContext } from '../_definitions'
import { EnvironmentInfo } from '../environments'

export function activateTerminal(
  context: vscode.ExtensionContext,
  extContext: ExtensionContext,
  info$: Observable<EnvironmentInfo>,
): DisposableLike {
  const { environmentVariableCollection: col } = context
  const sub = info$.subscribe((info: EnvironmentInfo) => {
    col.clear()
    col.persistent = false
    if (info.ok) {
      info.vars.forEach((x) => col.replace(x.name, x.value))
    } else {
      const pathPrependValue = `${extContext.micromambaDir}${path.delimiter}`
      col.prepend(pathKey, pathPrependValue)
      col.replace('MAMBA_ROOT_PREFIX', extContext.micromambaDir)
      col.replace('MAMBA_EXE', extContext.micromambaPath)
    }
  })
  return { dispose: () => sub.unsubscribe() }
}
