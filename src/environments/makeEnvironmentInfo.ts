import * as vscode from 'vscode'
import { Observable } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import {
  ActiveEnvironmentManager,
  ActiveEnvironmentPrefix,
  ExtensionContext,
} from '../_definitions'
import { getMicromambaEnvVariables } from '../micromamba'
import { EnvironmentFailed, EnvironmentInfo, EnvironmentOK } from './_definitions'

export function makeEnvironmentInfo(
  extContext: ExtensionContext,
  manager: ActiveEnvironmentManager,
): Observable<EnvironmentInfo> {
  return manager.prefix$.pipe(
    concatMap(async (prefix: ActiveEnvironmentPrefix) => {
      if (!prefix) {
        return {
          environmentName: prefix,
          ok: false,
        } as EnvironmentFailed
      }
      try {
        return {
          environmentName: prefix,
          vars: await getMicromambaEnvVariables(extContext, prefix),
          ok: true,
        } as EnvironmentOK
      } catch (ignore) {
        vscode.window.showErrorMessage(`Micromamba can't create ${prefix} environment`)
        return {
          environmentName: prefix,
          ok: false,
        } as EnvironmentFailed
      }
    }),
  )
}
