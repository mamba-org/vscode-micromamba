import { delimiter } from 'path';
import * as sh from 'shelljs';
import { ExtensionContext } from '../_definitions';
import { pathKey } from './infra';

export const configureShellJS = (extContext: ExtensionContext): void => {
  sh.config.fatal = true;
  sh.config.silent = true;
  sh.config.verbose = false;
  sh.env[pathKey] = [extContext.micromambaDir, sh.env[pathKey]].join(delimiter);
  sh.env['MAMBA_ROOT_PREFIX'] = extContext.micromambaDir;
  sh.env['MAMBA_EXE'] = extContext.micromambaPath;
};
