import { execSync } from 'child_process'
import { isWindows } from '../infra'
import { EnvironmentVariables } from './_definitions'
import { join } from 'path'
import { MicromambaParams } from './makeMicromambaParams'
import { shellActivate } from './micromamba'
import { appendFileSync, unlinkSync } from 'fs'
import { EnvironmentParams } from './makeSignals'

export function parseMicromambaShellActivateResponse(res: string) {
  return res
    .split('\r\n')
    .join('\n')
    .split('\n')
    .map((x) => x.split('='))
    .filter((x) => x.length === 2)
    .map((x) => {
      const name = x[0]
      const value = x[1]
      return { name, value }
    }) as EnvironmentVariables
}

export interface Params {
  micromambaParams: MicromambaParams
  environmentParams: NonNullable<EnvironmentParams>
}

export function makePrefix({ environmentParams, micromambaParams }: Params) {
  if (environmentParams.path) return environmentParams.path
  if (environmentParams.name) return join(micromambaParams.envsDir, environmentParams.name)
  throw new Error('unexpected error - empty environment input')
}

export async function getMicromambaEnvVariablesWin(params: Params) {
  const prefix = makePrefix(params)
  const cmdFilePath = shellActivate(params.micromambaParams, { shell: 'cmd.exe', prefix })
  appendFileSync(cmdFilePath, '\r\nset')
  const stdout = execSync(cmdFilePath, { encoding: 'utf-8' })
  unlinkSync(cmdFilePath)
  return parseMicromambaShellActivateResponse(stdout)
}

export async function getMicromambaEnvVariablesNonWin(params: Params) {
  const prefix = makePrefix(params)
  const bashActivateScript = shellActivate(params.micromambaParams, { shell: 'bash', prefix })
  const bashScript = [bashActivateScript, 'env'].join('\n')
  const stdout = execSync(bashScript, { encoding: 'utf8' })
  return parseMicromambaShellActivateResponse(stdout)
}

export const getMicromambaEnvVariables = isWindows
  ? getMicromambaEnvVariablesWin
  : getMicromambaEnvVariablesNonWin
