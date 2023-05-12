import { pathKey } from '../infra'
import { Observable } from 'rxjs'
import { DisposableLike } from '../_definitions'
import { delimiter } from 'path'
import { ExtensionContext } from 'vscode'
import { EnvironmentInfo } from '../micromamba'

export function activateTerminal(info$: Observable<EnvironmentInfo>, ctx: ExtensionContext): DisposableLike {
  const { environmentVariableCollection: col } = ctx
  const sub = info$.subscribe((x) => {
    col.clear()
    col.persistent = false
    if (x.ok) {
      x.vars.forEach((v) => col.replace(v.name, v.value))
    } else {
      const pathPrependValue = `${x.info.mambaRootPrefix}${delimiter}`
      col.prepend(pathKey, pathPrependValue)
      col.replace('MAMBA_ROOT_PREFIX', x.info.mambaRootPrefix)
      col.replace('MAMBA_EXE', x.info.mambaExe)
    }
  })
  return { dispose: () => sub.unsubscribe() }
}
