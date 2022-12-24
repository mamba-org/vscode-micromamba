import * as vscode from 'vscode'
import { join } from 'path'
import rimraf from 'rimraf'
import { CommandLike } from './_definitions'
import { pickMicromambaEnvironmentPrefixName } from '../environments'
import sh from '../helpers/sh'

export const runRemoveEnvironmentCommand: CommandLike = async ({ extContext, manager }) => {
  const prefixName = await pickMicromambaEnvironmentPrefixName(
    extContext,
    'Select environment to remove',
  )
  if (!prefixName) return
  manager.deactivate()
  const { micromambaDir } = extContext
  const tempDir = `${micromambaDir}_temp`
  const targetDir = join(tempDir, `${Date.now()}`)
  const envDir = join(micromambaDir, 'envs', prefixName)
  try {
    await sh.mkdirp(targetDir)
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't create directory: ${targetDir}`)
    return
  }
  try {
    if (await sh.testd(envDir)) await sh.mv(envDir, targetDir)
  } catch (ignore) {
    vscode.window.showErrorMessage(`Can't move directory: ${envDir}`)
    return
  }
  return vscode.window.withProgress(
    {
      title: 'Micromamba',
      location: vscode.ProgressLocation.Notification,
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: 'Deleting micromamba temp files' })
      try {
        await new Promise<void>((resolve, reject) =>
          rimraf(tempDir, (error) => {
            if (error) reject(error)
            else resolve()
          }),
        )
      } catch (ignore) {
        vscode.window.showErrorMessage(`Can't delete files in: ${tempDir}`)
      }
    },
  ) as Promise<void>
}
