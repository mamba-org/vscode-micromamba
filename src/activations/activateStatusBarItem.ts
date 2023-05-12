import { Observable } from 'rxjs'
import { Disposable, StatusBarAlignment, window } from 'vscode'
import { EnvironmentInfo } from '../micromamba'

export function activateStatusBarItem(info$: Observable<EnvironmentInfo>) {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
  const sub = info$.subscribe(({ info, environmentName }) => {
    const suffix = info.isLocal ? '' : '(G)'
    if (environmentName) statusBarItem.text = `µenv[${environmentName}]${suffix}`
    else statusBarItem.text = `µenv<none>${suffix}`
    statusBarItem.show()
  })
  return Disposable.from(statusBarItem, { dispose: () => sub.unsubscribe() })
}
