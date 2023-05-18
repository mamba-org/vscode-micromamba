import { pathKey } from '../infra'
import { Observable } from 'rxjs'
import { delimiter } from 'path'
import { ExtensionContext, WorkspaceFolder } from 'vscode'
import { readGlobalHomeDir } from '../micromamba/makeSignals'
import { makeMicromambaParams } from '../micromamba/makeMicromambaParams'
import { EnvironmentInfo } from '../micromamba'

const original = { path: process.env[pathKey] ?? ''}

export function initProcessEnv(ctx: ExtensionContext, workspaceFolder: WorkspaceFolder) {
  const globalHomeDir = readGlobalHomeDir(ctx)
  const info = makeMicromambaParams({ workspaceFolder, globalHomeDir })
  const basePath = [info.mambaRootPrefix, original.path].join(delimiter)
  process.env[pathKey] = basePath
  process.env['MAMBA_ROOT_PREFIX'] = info.mambaRootPrefix
  process.env['MAMBA_EXE'] = info.mambaExe
  setTimeout(() => {
    if (basePath === process.env[pathKey]) return
    original.path = process.env[pathKey] ?? ''
    process.env[pathKey] = [info.mambaRootPrefix, original.path].join(delimiter)
  }, 0)
}

export function activateProcessEnv(info$: Observable<EnvironmentInfo>) {
  const sub = info$.subscribe((info) => {
    if (info.ok) {
      info.vars.forEach((x) => (process.env[x.name] = x.value))
    } else {
      const { mambaExe, mambaRootPrefix} = info.params.micromambaParams
      process.env[pathKey] = `${mambaRootPrefix}${delimiter}${original.path}`
      process.env['MAMBA_ROOT_PREFIX'] = mambaRootPrefix
      process.env['MAMBA_EXE'] = mambaExe
    }
  })
  return { dispose: () => sub.unsubscribe() }
}
