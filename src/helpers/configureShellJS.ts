import { delimiter } from 'path'
import { ExtensionContext } from '../_definitions'
import { pathKey } from './infra'
import sh from './sh'

export const configureShellJS = (extContext: ExtensionContext): void => {
  sh.env[pathKey] = [extContext.micromambaDir, sh.env[pathKey]].join(delimiter)
  sh.env['MAMBA_ROOT_PREFIX'] = extContext.micromambaDir
  sh.env['MAMBA_EXE'] = extContext.micromambaPath
}
