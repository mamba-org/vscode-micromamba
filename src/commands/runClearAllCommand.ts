import rimraf from 'rimraf'
import { CommandLike } from './_definitions'
import sh from '../sh'
import { ProgressLocation, window } from 'vscode'
import { join } from 'path'
import { askToReloadWindow } from './helpers'

export const runClearAllCommand: CommandLike = async ({ info, signals }) => {
  signals.activeEnvironmentName.set(undefined)
  const { mambaRootPrefix: micromambaDir } = info
  const tempDir = `${micromambaDir}_temp`
  const targetDir = join(tempDir, `${Date.now()}`)
  try {
    await sh.mkdirp(targetDir)
  } catch (ignore) {
    window.showErrorMessage(`Can't create directory: ${targetDir}`)
    return Promise.resolve()
  }
  try {
    if (await sh.testd(micromambaDir)) await sh.mv(micromambaDir, targetDir)
  } catch (ignore) {
    window.showErrorMessage(`Can't move directory: ${micromambaDir}`)
    return Promise.resolve()
  }
  return window.withProgress(
    {
      title: 'Micromamba',
      location: ProgressLocation.Notification,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Deleting micromamba files' })
      try {
        await rimraf(tempDir)
      } catch (ignore) {
        window.showErrorMessage(`Can't clear files in: ${tempDir}`)
      }
      askToReloadWindow()
    },
  ) as Promise<void>
}
