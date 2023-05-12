import * as path from 'path'
import { https } from 'follow-redirects'
import { Writable } from 'stream'
import * as tar from 'tar'
import bz2 from 'unbzip2-stream'
import { URL } from 'url'
import sh from '../sh'

export const _downloadMicromamba = async (url: string, tar: Writable): Promise<void> => {
  try {
    await _downloadMicromamba1(url, tar)
  } catch (err) {
    await _downloadMicromamba2(url, tar)
  }
}

export const _downloadMicromamba1 = (url: string, tar: Writable): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const req = https.get(url, (res) => res.pipe(bz2()).pipe(tar))
      req.on('error', (err) => reject(err))
      tar.on('error', (err) => reject(err))
      tar.on('finish', () => resolve())
    } catch (err) {
      reject(err)
    }
  })
}

export const _downloadMicromamba2 = (url: string, tar: Writable): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const u = new URL(url)
      const req = https.get(
        {
          host: u.host,
          path: u.pathname,
          rejectUnauthorized: false,
        },
        (res) => res.pipe(bz2()).pipe(tar),
      )
      req.on('error', (err) => reject(err))
      tar.on('error', (err) => reject(err))
      tar.on('finish', () => resolve())
    } catch (err) {
      reject(err)
    }
  })
}

export const downloadMicromambaWin = async (cwd: string): Promise<void> => {
  const url = 'https://micromamba.snakepit.net/api/micromamba/win-64/latest'
  const stream = tar.x({ cwd, strip: 2 }, ['Library/bin/micromamba.exe'])
  await _downloadMicromamba(url, stream)
}

export const downloadMicromambaMac = async (cwd: string): Promise<void> => {
  const url = 'https://micromamba.snakepit.net/api/micromamba/osx-64/latest'
  const stream = tar.x({ cwd, strip: 1 }, ['bin/micromamba'])
  await _downloadMicromamba(url, stream)
  await sh.chmodR('755', cwd)
  await sh.chmod('755', path.join(cwd, 'micromamba'))
}

export const downloadMicromambaLinux = async (cwd: string): Promise<void> => {
  const url = 'https://micromamba.snakepit.net/api/micromamba/linux-64/latest'
  const stream = tar.x({ cwd, strip: 1 }, ['bin/micromamba'])
  await _downloadMicromamba(url, stream)
  await sh.chmodR('755', cwd)
  await sh.chmod('755', path.join(cwd, 'micromamba'))
}

export const downloadMicromamba = (() => {
  switch (process.platform) {
    case 'linux':
      return downloadMicromambaLinux
    case 'win32':
      return downloadMicromambaWin
    case 'darwin':
      return downloadMicromambaMac
    default:
      throw new Error(`Unsuported platform ${process.platform}`)
  }
})()
