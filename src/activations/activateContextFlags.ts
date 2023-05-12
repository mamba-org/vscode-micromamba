import { Observable } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import sh from '../sh'
import { commands } from 'vscode'
import { EnvironmentInfo, findMicromambaEnvironmentQuickPickItems } from '../micromamba'

function setContext<T>(key: string, value: T) {
  commands.executeCommand('setContext', key, value)
}

export const activateContextFlags = (info$: Observable<EnvironmentInfo>) => {
  const sub = info$
    .pipe(
      concatMap(async ({ environmentName, info }) => ({
        environmentName,
        info,
        items: await findMicromambaEnvironmentQuickPickItems(info),
      })),
    )
    .subscribe(async ({ environmentName, info, items }) => {
      const item = items.find((x) => x.data.content.name === environmentName)
      const hasCreatedEnvs = items.length > 0
      const hasActivatedEnv = !!item
      const hasMambaRootPrefix = await sh.testd(info.mambaRootPrefix)
      const hasMambaExe = await sh.testf(info.mambaExe)
      setContext('corker.micromamba.can.activate.environment', hasCreatedEnvs)
      setContext('corker.micromamba.can.deactivate.environment', hasActivatedEnv)
      setContext('corker.micromamba.can.remove.environment', hasActivatedEnv)
      setContext('corker.micromamba.can.clear.all', hasMambaRootPrefix)
      setContext('corker.micromamba.can.use.global.home.dir', info.isLocal)
      setContext('corker.micromamba.can.use.local.home.dir', !info.isLocal)
      setContext('corker.micromamba.can.self.update', hasMambaExe)
    })
  return { dispose: () => sub.unsubscribe() }
}
