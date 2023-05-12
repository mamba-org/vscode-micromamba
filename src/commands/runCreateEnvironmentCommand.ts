import { CommandLike } from './_definitions'
import { createMicromambaEnvironment, ensureMicromamba, pickMicromambaEnvironmentFile } from '../micromamba'
import { isNativeError } from 'util/types'
import { ProgressLocation, window } from 'vscode'
import { askToReloadWindow } from './helpers'
import { updateMicromamba } from '../micromamba/updateMicromamba'
import { ensureMicromambaDir } from '../micromamba/ensureMicromambaDir'

export const runCreateEnvironmentCommand: CommandLike = async ({ info, signals, ch }) => {
  try {
    signals.activeEnvironmentName.set(undefined)
    const environmentFile = await pickMicromambaEnvironmentFile(info)
    if (!environmentFile) return
    ensureMicromambaDir(info)
    await window.withProgress(
      {
        title: 'Micromamba',
        location: ProgressLocation.Notification,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Downloading' })
        try {
          await ensureMicromamba(info.mambaRootPrefix)
        } catch (ignore) {
          throw new Error(`Can't download micromamba`)
        }
        progress.report({ message: 'Updating'})
        try {
          await updateMicromamba(info, ch)
        } catch (ignore) {
          throw new Error(`Can't update micromamba`)
        }
        progress.report({ message: 'Creating environment'})
        try {
          await createMicromambaEnvironment(info, environmentFile, ch)
        } catch (ignore) {
          throw new Error(`Can't create environment`)
        }
      })
    signals.activeEnvironmentName.set(environmentFile.content.name)
  } catch (error) {
    const message = isNativeError(error) ? error.message : `Can't create micromamba environment`
    window.showErrorMessage(message)
  }
  askToReloadWindow()
}
