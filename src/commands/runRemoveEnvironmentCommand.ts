import { join } from 'path'
import rimraf from 'rimraf'
import { CommandLike } from './_definitions'
import sh from '../sh'
import { ProgressLocation, window } from 'vscode'
import { askToReloadWindow } from './helpers'
import { pickMicromambaEnvironmentPrefixName } from '../micromamba'

export const runRemoveEnvironmentCommand: CommandLike = async ({ params, signals }) => {
  const { micromambaParams } = params
  const placeHolder = 'Select environment to remove'
  const prefixName = await pickMicromambaEnvironmentPrefixName(micromambaParams, placeHolder)
  if (!prefixName) return
  signals.activeEnvironmentInput.set(undefined)
  const { envsDir } = micromambaParams
  const tempDir = `${envsDir}_temp`
  const targetDir = join(tempDir, `${Date.now()}`)
  const envDir = join(envsDir, prefixName)
  try {
    await sh.mkdirp(targetDir)
  } catch (ignore) {
    window.showErrorMessage(`Can't create directory: ${targetDir}`)
    return
  }
  try {
    if (await sh.testd(envDir)) await sh.mv(envDir, targetDir)
  } catch (ignore) {
    window.showErrorMessage(`Can't move directory: ${envDir}`)
    return
  }
  return window.withProgress(
    {
      title: 'Micromamba',
      location: ProgressLocation.Notification,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Deleting micromamba temp files' })
      try {
        await rimraf(tempDir)
      } catch (ignore) {
        window.showErrorMessage(`Can't delete files in: ${tempDir}`)
      }
      askToReloadWindow()
    },
  ) as Promise<void>
}
