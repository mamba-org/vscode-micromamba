import { Observable } from 'rxjs'
import { Disposable, StatusBarAlignment, window } from 'vscode'
import { EnvironmentInfo } from '../micromamba'

export function activateStatusBarItem(info$: Observable<EnvironmentInfo>) {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)
  const sub = info$.subscribe(({ params: { environmentParams, micromambaParams} }) => {
    const suffix = micromambaParams.isLocal ? '' : '(G)'
    if (environmentParams?.name) statusBarItem.text = `µenv[${environmentParams.name}]${suffix}`
    else if (environmentParams?.path) statusBarItem.text = `µenv<custom>${suffix}`
    else statusBarItem.text = `µenv<none>${suffix}`
    statusBarItem.show()
  })
  return Disposable.from(statusBarItem, { dispose: () => sub.unsubscribe() })
}
