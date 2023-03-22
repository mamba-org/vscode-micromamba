import * as path from 'path'
import { pathKey } from '../helpers/infra'
import { Observable } from 'rxjs'
import { DisposableLike, ExtensionContext } from '../_definitions'
import { EnvironmentInfo } from '../environments'

const originalPath = process.env[pathKey]

export function activateProcessEnv(
  extContext: ExtensionContext,
  info$: Observable<EnvironmentInfo>,
): DisposableLike {
  const sub = info$.subscribe((info) => {
    if (info.ok) {
      info.vars.forEach((x) => (process.env[x.name] = x.value))
    } else {
      process.env[pathKey] = `${extContext.micromambaDir}${path.delimiter}${originalPath}`
      process.env['MAMBA_ROOT_PREFIX'] = extContext.micromambaDir
      process.env['MAMBA_EXE'] = extContext.micromambaPath
    }
  })
  return { dispose: () => sub.unsubscribe() }
}
