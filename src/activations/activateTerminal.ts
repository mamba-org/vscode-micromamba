import { pathKey } from '../infra'
import { Observable } from 'rxjs'
import { DisposableLike } from '../_definitions'
import { delimiter } from 'path'
import { ExtensionContext } from 'vscode'
import { EnvironmentInfo } from '../micromamba'

export function activateTerminal(info$: Observable<EnvironmentInfo>, ctx: ExtensionContext): DisposableLike {
  const { environmentVariableCollection: col } = ctx
  const sub = info$.subscribe((info) => {
    col.clear()
    col.persistent = false
    if (info.ok) {
      info.vars.forEach((v) => col.replace(v.name, v.value))
    } else {
      const { mambaRootPrefix, mambaExe } = info.params.micromambaParams
      const pathPrependValue = `${mambaRootPrefix}${delimiter}`
      col.prepend(pathKey, pathPrependValue)
      col.replace('MAMBA_ROOT_PREFIX', mambaRootPrefix)
      col.replace('MAMBA_EXE', mambaExe)
    }
  })
  return { dispose: () => sub.unsubscribe() }
}
