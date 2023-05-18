import { CommandLike } from './_definitions'
import { createMicromambaEnvironment, ensureMicromamba, pickMicromambaEnvironmentFile } from '../micromamba'
import { isNativeError } from 'util/types'
import { ProgressLocation, window } from 'vscode'
import { askToReloadWindow } from './helpers'
import { updateMicromamba } from '../micromamba/updateMicromamba'
import { ensureMicromambaDir } from '../micromamba/ensureMicromambaDir'

export const runCreateEnvironmentCommand: CommandLike = async ({ params, signals, ch }) => {
  try {
    signals.activeEnvironmentInput.set(undefined)
    const { micromambaParams } = params
    const environmentFile = await pickMicromambaEnvironmentFile(micromambaParams)
    if (!environmentFile) return
    ensureMicromambaDir(micromambaParams)
    await window.withProgress(
      {
        title: 'Micromamba',
        location: ProgressLocation.Notification,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Downloading' })
        try {
          await ensureMicromamba(micromambaParams.mambaRootPrefix)
        } catch (ignore) {
          throw new Error(`Can't download micromamba`)
        }
        progress.report({ message: 'Updating'})
        try {
          await updateMicromamba(micromambaParams, ch)
        } catch (ignore) {
          throw new Error(`Can't update micromamba`)
        }
        progress.report({ message: 'Creating environment'})
        try {
          await createMicromambaEnvironment(micromambaParams, environmentFile, ch)
        } catch (ignore) {
          throw new Error(`Can't create environment`)
        }
      })
    signals.activeEnvironmentInput.set({ name: environmentFile.content.name, path: undefined })
  } catch (error) {
    const message = isNativeError(error) ? error.message : `Can't create micromamba environment`
    window.showErrorMessage(message)
  }
  askToReloadWindow()
}
