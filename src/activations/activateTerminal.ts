import { pathKey } from '../infra'
import { Observable } from 'rxjs'
import { DisposableLike } from '../_definitions'
import { delimiter } from 'path'
import { EnvironmentVariableMutatorOptions, ExtensionContext } from 'vscode'
import { EnvironmentInfo } from '../micromamba'

export function activateTerminal(info$: Observable<EnvironmentInfo>, ctx: ExtensionContext): DisposableLike {
  const processCreationOnlyOption = { applyAtProcessCreation: true, applyAtShellIntegration: false } as EnvironmentVariableMutatorOptions
  const forceAtShellIntegrationOption = { applyAtProcessCreation: true, applyAtShellIntegration: true } as EnvironmentVariableMutatorOptions
  const { environmentVariableCollection: col } = ctx
  const sub = info$.subscribe((info) => {
    col.clear()
    col.persistent = false
    if (info.ok) {
      info.vars.forEach((v) => col.replace(v.name, v.value, v.name === pathKey ? forceAtShellIntegrationOption : processCreationOnlyOption))
    } else {
      const { mambaRootPrefix, mambaExe } = info.params.micromambaParams
      const pathPrependValue = `${mambaRootPrefix}${delimiter}`
      col.prepend(pathKey, pathPrependValue, forceAtShellIntegrationOption)
      col.replace('MAMBA_ROOT_PREFIX', mambaRootPrefix, forceAtShellIntegrationOption)
      col.replace('MAMBA_EXE', mambaExe, forceAtShellIntegrationOption)
    }
  })
  return { dispose: () => sub.unsubscribe() }
}
