import { Observable } from 'rxjs'
import { EnvironmentInfo, createEnvFile } from '../micromamba'

export function activateDotEnvFile(info$: Observable<EnvironmentInfo>) {
  const sub = info$.subscribe((x) => {
    if (x.ok) createEnvFile(x.vars, x.params.micromambaParams, x.params.environmentParams?.name ?? 'custom')
  })
  return { dispose: () => sub.unsubscribe() }
}
