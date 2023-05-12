import { execSync } from 'child_process'
import { isWindows } from '../infra'
import { EnvironmentVariable, EnvironmentVariables } from './_definitions'
import { join } from 'path'
import { MicromambaInfo } from './makeMicromambaInfo'
import { shellActivate } from './micromamba'
import { appendFileSync, unlinkSync } from 'fs'

export const parseMicromambaShellActivateResponse = (
  res: string,
): EnvironmentVariable[] =>
  res
    .split('\r\n')
    .join('\n')
    .split('\n')
    .map((x) => x.split('='))
    .filter((x) => x.length === 2)
    .map((x) => {
      const name = x[0]
      const value = x[1]
      return { name, value }
    })

export const getMicromambaEnvVariablesWin = async (
  info: MicromambaInfo,
  prefixName: string,
): Promise<EnvironmentVariables> => {
  const prefix = join(info.envsDir, prefixName)
  const cmdFilePath = shellActivate(info, { shell: 'cmd.exe', prefix })
  appendFileSync(cmdFilePath, '\r\nset')
  const stdout = execSync(cmdFilePath, { encoding: 'utf-8' })
  unlinkSync(cmdFilePath)
  return parseMicromambaShellActivateResponse(stdout)
}

export const getMicromambaEnvVariablesNonWin = async (
  info: MicromambaInfo,
  prefixName: string,
): Promise<EnvironmentVariables> => {
  const prefix = join(info.envsDir, prefixName)
  const bashActivateScript = shellActivate(info, { shell: 'bash', prefix })
  const bashScript = [bashActivateScript, 'env'].join('\n')
  const stdout = execSync(bashScript, { encoding: 'utf8' })
  return parseMicromambaShellActivateResponse(stdout)
}

export const getMicromambaEnvVariables = isWindows
  ? getMicromambaEnvVariablesWin
  : getMicromambaEnvVariablesNonWin
