import { spawn } from 'child_process'
import { Observable } from 'rxjs'
import { isWindows } from '../infra'
import { spawnSync } from 'child_process'

const commonArgs = [
  '--no-rc',
  '--no-env',
  '--yes',
]

export interface MicromambaConfig {
  mambaRootPrefix: string
  mambaExe: string
}

export interface MicromambaParams {
  cwd?: string
  args: string[]
}

export const micromamba = (
  config: MicromambaConfig,
  params: { cwd?: string; args: string[] }
): string => {
  const res = spawnSync(config.mambaExe, [
    ...params.args,
    ...commonArgs,
  ], { cwd: params.cwd, encoding: 'utf8' })
  if (res.error) throw res.error
  if (res.status !== 0) throw new Error(res.stderr)
  return res.stdout
}

export function micromamba$(
  config: MicromambaConfig,
  params: { cwd?: string; args: string[] }
) {
  return new Observable<string>((subscriber) => {
    const child = spawn(config.mambaExe, [
      ...params.args,
      ...commonArgs,
    ], { cwd: params.cwd })
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (chunk) => {
      const data = isWindows ? chunk.toString() : chunk.toString().replaceAll('\n', '\r\n')
      subscriber.next(data)
    })
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      const data = isWindows ? chunk.toString() : chunk.toString().replaceAll('\n', '\r\n')
      subscriber.next(data)
    })
    child.on('error', (err) => subscriber.next(`${err.name}: ${err.message}`))
    child.on('close', (code) => {
      if (code === 0)
        subscriber.complete()

      else
        subscriber.error(code)
    })
    return () => child.kill()
  })
}

export const help = (config: MicromambaConfig): string => {
  const args = ['create', '--help']
  return micromamba(config, { args })
}

export const create = (
  config: MicromambaConfig,
  params: { file: string }
): string => {
  const args = ['create', '--file', params.file, '--root-prefix', config.mambaRootPrefix, '--retry-clean-cache']
  return micromamba(config, { args })
}

export const shellActivate = (
  config: MicromambaConfig,
  params: { prefix: string, shell: 'cmd.exe' | 'bash' }
): string => {
  const args = ['shell', 'activate', '--shell', params.shell, '--prefix', params.prefix]
  return micromamba(config, { args })
}

export function selfUpdate$(config: MicromambaConfig) {
  const args = ['self-update', '-c', 'conda-forge']
  return micromamba$(config, { args })
}

export function create$(
  config: MicromambaConfig,
  params: { file: string; prefix: string}
) {
  const args = ['create', '--file', params.file, '--root-prefix', config.mambaRootPrefix, '--prefix', params.prefix, '--retry-clean-cache']
  return micromamba$(config, { args })
}
