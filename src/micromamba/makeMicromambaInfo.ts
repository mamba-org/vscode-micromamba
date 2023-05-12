import { WorkspaceFolder } from 'vscode'
import { join } from 'path'
import { isWindows } from '../infra'
import crypto from 'crypto'

const exeName = isWindows ? 'micromamba.exe' : 'micromamba'
const dirName = '.micromamba'

interface Params {
  workspaceFolder: WorkspaceFolder
  globalHomeDir: string | undefined
}

export function makeMicromambaInfo({ workspaceFolder, globalHomeDir }: Params) {
  const workspaceDir = workspaceFolder.uri.fsPath
  const workspaceMicromambaDir = join(workspaceDir, dirName)
  if (globalHomeDir === undefined) {
    const mambaRootPrefix = join(workspaceDir, dirName)
    const mambaExe = join(mambaRootPrefix, exeName)
    const envsDir = join(mambaRootPrefix, 'envs')
    return { workspaceDir, workspaceMicromambaDir, mambaRootPrefix, mambaExe, envsDir, isLocal: true }
  } else {
    const mambaRootPrefix = globalHomeDir
    const mambaExe = join(mambaRootPrefix, exeName)
    const hash = crypto.createHash('sha1').update(workspaceDir).digest('hex').slice(0, 8)
    const envsDir = join(mambaRootPrefix, 'envs', hash);
    return { workspaceDir, workspaceMicromambaDir, mambaRootPrefix, mambaExe, envsDir, isLocal: false }
  }
}

export type MicromambaInfo = ReturnType<typeof makeMicromambaInfo>
