import * as vscode from 'vscode'
import * as path from 'path'
import rimraf from 'rimraf'
import { CommandLike } from './_definitions'
import sh from '../helpers/sh'

export const runClearAllCommand: CommandLike = async ({ extContext, manager }) => {
  manager.deactivate()
  const { micromambaDir } = extContext
  const tempDir = `${micromambaDir}_temp`
  const targetDir = path.join(tempDir, `${Date.now()}`)
  try {
    await sh.mkdirp(targetDir)
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't create directory: ${targetDir}`)
    return Promise.resolve()
  }
  try {
    if (await sh.testd(micromambaDir)) await sh.mv(micromambaDir, targetDir)
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't move directory: ${micromambaDir}`)
    return Promise.resolve()
  }
  return vscode.window.withProgress(
    {
      title: 'Micromamba',
      location: vscode.ProgressLocation.Notification,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Deleting micromamba files' })
      try {
        await rimraf(tempDir)
      } catch (ignore) {
        vscode.window.showErrorMessage(`Can't clear files in: ${tempDir}`)
      }
    },
  ) as Promise<void>
}
