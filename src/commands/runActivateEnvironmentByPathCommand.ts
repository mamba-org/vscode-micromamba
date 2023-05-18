import { ProgressLocation, window } from 'vscode'
import { CommandLike } from './_definitions'
import { askToReloadWindow } from './helpers'
import { ensureMicromambaDir } from '../micromamba/ensureMicromambaDir'
import { ensureMicromamba } from '../micromamba'

export const runActivateEnvironmentByPathCommand: CommandLike = async ({ params, signals }) => {
  const uris = await window.showOpenDialog({
    canSelectFolders: true,
    openLabel: 'Activate',
    title: 'micromamba: Select existing environment',
  })
  if (!uris) return
  const { micromambaParams } = params
  await ensureMicromambaDir(micromambaParams)
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
    })
  signals.activeEnvironmentInput.set({ name: undefined, path: uris[0].fsPath })
  askToReloadWindow()
}
