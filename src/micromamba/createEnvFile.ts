import * as fs from 'fs'
import { join } from 'path'
import { EnvironmentVariables } from '../micromamba'
import { MicromambaInfo } from './makeMicromambaInfo'

export const escapeValue = (value: string): string =>
  value.replace(/\n/g, '\\n').replace(/"/g, '""')

export const createEnvFile = (
  vars: EnvironmentVariables,
  info: MicromambaInfo,
  prefixName: string,
): void => {
  const envFilePath = join(info.workspaceMicromambaDir, `.env.${prefixName}`)
  const data = [...vars.map((x) => `${x.name}="${x.value}"`)].join('\n')
  fs.writeFileSync(envFilePath, data, { encoding: 'utf8' })
}
