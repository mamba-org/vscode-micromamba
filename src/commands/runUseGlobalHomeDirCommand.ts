import { Uri, window } from 'vscode'
import { CommandLike } from './_definitions'
import { isWindows } from '../infra'
import os from 'os'
import { join } from 'path'
import sh from '../sh'
import { askToReloadWindow } from './helpers'

export const runUseGlobalHomeDirCommand: CommandLike = async ({ signals, ch }) => {
  if (isWindows) {
    const uris = await window.showOpenDialog({
      canSelectFolders: true,
      openLabel: 'Home',
      title: 'micromamba: Global home directory',
      defaultUri: Uri.file('C:/')
    })
    if (!uris) return
    const homeDir = join(uris[0].fsPath, '.micromamba')
    await sh.mkdirp(homeDir)
    signals.activeEnvironmentName.set(undefined)
    signals.globalHomeDir.set(homeDir)
    ch.appendLine(`Global home directory: ${homeDir}`)
    askToReloadWindow()
  } else {
    const homeDir = join(os.homedir(), '.vscode-micromamba')
    await sh.mkdirp(homeDir)
    signals.activeEnvironmentName.set(undefined)
    signals.globalHomeDir.set(homeDir)
    ch.appendLine(`Global home directory: ${homeDir}`)
    askToReloadWindow()
  }
}
