import * as vscode from 'vscode'
import { join } from 'path'
import { ExtensionContext } from '../_definitions'
import { CommandLike } from './_definitions'
import { ensureMicromamba, makeMicromambaCreateEnvironmentTask } from '../micromamba'
import { MicromambaEnvironmentFile, pickMicromambaEnvironmentFile } from '../environments'
import { isNativeError } from 'util/types'
import sh from '../helpers/sh'

const _ensureMicromambaDir = async (extContext: ExtensionContext) => {
  try {
    await sh.mkdirp(extContext.micromambaDir)
    const gitIgnorePath = join(extContext.micromambaDir, '.gitignore')
    if (!(await sh.testf(gitIgnorePath))) await sh.writeFile(gitIgnorePath, '*')
  } catch (ignore) {
    throw new Error(`Can't create directory: ${extContext.micromambaDir}`)
  }
}

const _ensureMicromamba = async (extContext: ExtensionContext): Promise<void> => {
  try {
    await vscode.window.withProgress(
      {
        title: 'Micromamba',
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: 'Downloading micromamba' })
        await ensureMicromamba(extContext.micromambaDir)
      },
    )
  } catch (ignore) {
    throw new Error(`Can't download micromamba`)
  }
}

const _createEnvironment = async (extContext: ExtensionContext, environmentFile: MicromambaEnvironmentFile): Promise<void> => {
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
    if (!workspaceFolder) return Promise.resolve()
    const task = makeMicromambaCreateEnvironmentTask(extContext, environmentFile.fileName, workspaceFolder)
    const value = await vscode.tasks.executeTask(task)
    await new Promise<void>((resolve) => {
      const dis = vscode.tasks.onDidEndTask((e) => {
        if (e.execution != value) return
        dis.dispose()
        resolve()
      })
    })
  } catch (ignore) {
    throw new Error(`Can't initialize micromamba`)
  }
}

export const runCreateEnvironmentCommand: CommandLike = async ({ extContext, manager }) => {
  try {
    manager.deactivate()
    const environmentFile = await pickMicromambaEnvironmentFile(extContext)
    if (!environmentFile) return
    _ensureMicromambaDir(extContext)
    await _ensureMicromamba(extContext)
    await _createEnvironment(extContext, environmentFile)
    manager.activate(environmentFile.content.name)
  } catch (error) {
    const message = isNativeError(error) ? error.message : `Can't create micromamba environment`
    vscode.window.showErrorMessage(message)
  }
}
