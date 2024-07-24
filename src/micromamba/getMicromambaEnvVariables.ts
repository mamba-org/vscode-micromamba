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
    .filter((x) => x.length === 2 && !isExcludedEnvVar(x[0]))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((x) => {
      const name = x[0]
      const value = x[1]
      return { name, value }
    }) as EnvironmentVariables
}

const excludedEnvVars = [
  'PWD', 'OLDPWD', // Current and previous working directories, process specific
  'SHLVL', '_', 'SHELL', 'CONDA_SHLVL', 'COMMAND_MODE', // Shell specific runtime variables
  'DISPLAY', // Display server configuration for the current instance of the VSCode
  'USER', 'LOGNAME', 'HOME' // User specific variables, provided by the system
]
function isExcludedEnvVar(name: string) {
  return excludedEnvVars.includes(name)
    || name.startsWith('VSCODE_') // VSCode internal helper variables
    || name.startsWith('ELECTRON_') // Electron internal helper variables
    || name.startsWith('HOMEBREW_') // Homebrew configuration, homebrew is external to the environment
    || name.startsWith('__CF') // CoreFoundation configuration, process specific
    || name.startsWith('XPC_') // XPC configuration, process specific
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
