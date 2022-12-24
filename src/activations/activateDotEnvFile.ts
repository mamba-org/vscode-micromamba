import { Observable } from 'rxjs'
import { createEnvFile, EnvironmentInfo } from '../environments'
import { DisposableLike, ExtensionContext } from '../_definitions'

export function activateDotEnvFile(
  extContext: ExtensionContext,
  info$: Observable<EnvironmentInfo>,
): DisposableLike {
  const sub = info$.subscribe((info) => {
    if (!info.ok) return
    createEnvFile(info.vars, extContext, info.environmentName)
  })
  return { dispose: () => sub.unsubscribe() }
}
