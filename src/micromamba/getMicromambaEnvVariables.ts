import * as fs from 'fs'
import * as path from 'path'
import { exec, ExecOptionsWithStringEncoding } from 'child_process'
import { isWindows, pathKey } from '../helpers/infra'
import { EnvironmentVariables } from './_definitions'

export const parseMicromambaShellActivateResponse = (
  res: string,
): { name: string; value: string }[] =>
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

const getExecOptions = (
  micromambaDir: string,
  micromambaPath: string,
): ExecOptionsWithStringEncoding => ({
  encoding: 'utf-8' as BufferEncoding,
  env: {
    PATH: [micromambaDir, process.env[pathKey]].join(path.delimiter),
    MAMBA_ROOT_PREFIX: micromambaDir,
    MAMBA_EXE: micromambaPath,
  } as NodeJS.ProcessEnv,
})

const execAsync = (command: string, execOptions: ExecOptionsWithStringEncoding): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    exec(command, execOptions, (err, stdout) => {
      if (err) reject(err)
      else resolve(stdout)
    })
  })

export const getMicromambaEnvVariablesWin = async (
  options: {
    micromambaDir: string
    micromambaPath: string
  },
  prefixName: string,
): Promise<EnvironmentVariables> => {
  const { micromambaDir, micromambaPath } = options
  const execOptions = getExecOptions(micromambaDir, micromambaPath)
  const command = `micromamba shell activate -s cmd.exe -p ${prefixName}`
  const cmdFilePath = await execAsync(command, execOptions)
  await fs.promises.appendFile(cmdFilePath, '\r\nset')
  const res = await execAsync(cmdFilePath, execOptions)
  await fs.promises.unlink(cmdFilePath)
  return parseMicromambaShellActivateResponse(res)
}

export const getMicromambaEnvVariablesNonWin = async (
  options: {
    micromambaDir: string
    micromambaPath: string
  },
  prefixName: string,
): Promise<EnvironmentVariables> => {
  const { micromambaDir, micromambaPath } = options
  const execOptions = getExecOptions(micromambaDir, micromambaPath)
  const command = `micromamba shell activate -s bash -p ${prefixName}`
  const bashActivateScript = await execAsync(command, execOptions)
  const bashScript = [bashActivateScript, 'env'].join('\n')
  const res = await execAsync(bashScript, execOptions)
  return parseMicromambaShellActivateResponse(res)
}

export const getMicromambaEnvVariables = isWindows
  ? getMicromambaEnvVariablesWin
  : getMicromambaEnvVariablesNonWin
