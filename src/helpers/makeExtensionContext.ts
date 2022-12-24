import * as vscode from 'vscode'
import * as path from 'path'
import { ExtensionContext } from '../_definitions'

export const makeExtensionContext = (workspaceFolder: vscode.WorkspaceFolder): ExtensionContext => {
  const rootDir = workspaceFolder.uri.fsPath
  const micromambaDir = path.join(rootDir, '.micromamba')
  const micromambaPath = path.join(
    micromambaDir,
    process.platform === 'win32' ? 'micromamba.exe' : 'micromamba',
  )
  return { rootDir, micromambaDir, micromambaPath }
}
