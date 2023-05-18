import { lastValueFrom, tap } from 'rxjs'
import { join } from 'path'
import { OutputChannel } from 'vscode'
import { MicromambaParams } from './makeMicromambaParams'
import { MicromambaEnvironmentFile } from './_definitions'
import { create$ } from './micromamba'

export function createMicromambaEnvironment(micromambaParams: MicromambaParams, environmentFile: MicromambaEnvironmentFile, ch: OutputChannel) {
  const prefix = join(micromambaParams.envsDir, environmentFile.content.name)
  const process$ = create$(micromambaParams, { file: environmentFile.filePath, prefix })
  return lastValueFrom(process$.pipe(tap(ch.append)))
}
