import rimraf from 'rimraf'
import { CommandLike } from './_definitions'
import sh from '../sh'
import { ProgressLocation, window } from 'vscode'
import { join } from 'path'
import { askToReloadWindow } from './helpers'

export const runClearAllCommand: CommandLike = async ({ params, signals }) => {
  signals.activeEnvironmentInput.set(undefined)
  const { mambaRootPrefix } = params.micromambaParams
  const tempDir = `${mambaRootPrefix}_temp`
  const targetDir = join(tempDir, `${Date.now()}`)
  try {
    await sh.mkdirp(targetDir)
  } catch (ignore) {
    window.showErrorMessage(`Can't create directory: ${targetDir}`)
    return Promise.resolve()
  }
  try {
    if (await sh.testd(mambaRootPrefix)) await sh.mv(mambaRootPrefix, targetDir)
  } catch (ignore) {
    window.showErrorMessage(`Can't move directory: ${mambaRootPrefix}`)
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
