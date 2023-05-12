import { lastValueFrom, tap } from 'rxjs'
import { join } from 'path'
import { OutputChannel } from 'vscode'
import { MicromambaInfo } from './makeMicromambaInfo'
import { MicromambaEnvironmentFile } from './_definitions'
import { create$ } from './micromamba'

export function createMicromambaEnvironment(info: MicromambaInfo, environmentFile: MicromambaEnvironmentFile, ch: OutputChannel) {
  const prefix = join(info.envsDir, environmentFile.content.name)
  const process$ = create$(info, { file: environmentFile.filePath, prefix })
  return lastValueFrom(process$.pipe(tap(ch.append)))
}
