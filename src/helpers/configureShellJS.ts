import { delimiter } from 'path'
import { ExtensionContext } from '../_definitions'
import { pathKey } from './infra'

const _configureShellJS = (extContext: ExtensionContext): void => {
  const envPath = process.env[pathKey] ?? ''
  if (envPath?.startsWith(extContext.micromambaDir)) return
  process.env[pathKey] = [extContext.micromambaDir, envPath].join(delimiter)
  process.env['MAMBA_ROOT_PREFIX'] = extContext.micromambaDir
  process.env['MAMBA_EXE'] = extContext.micromambaPath
}

export const configureShellJS = (extContext: ExtensionContext): void => {
  _configureShellJS(extContext)
  setTimeout(() => _configureShellJS(extContext), 0)
}
