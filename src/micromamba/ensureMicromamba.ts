import { join } from 'path'
import sh from '../sh'
import { downloadMicromamba } from './downloadMicromamba'

export const _isMicromambaInstalled = (path: string) => {
  return sh.testf(path)
}

export const isMicromambaInstalledWin = (cwd: string) => {
  return _isMicromambaInstalled(join(cwd, 'micromamba.exe'))
}

export const isMicromambaInstalledMac = (cwd: string) => {
  return _isMicromambaInstalled(join(cwd, 'micromamba'))
}

export const isMicromambaInstalledLinux = (cwd: string) => {
  return _isMicromambaInstalled(join(cwd, 'micromamba'))
}

export const isMicromambaInstalled = (cwd: string) => {
  switch (process.platform) {
    case 'linux':
      return isMicromambaInstalledLinux(cwd)
    case 'win32':
      return isMicromambaInstalledWin(cwd)
    case 'darwin':
      return isMicromambaInstalledMac(cwd)
    default:
      throw new Error(`Unsuported platform ${process.platform}`)
  }
}

export const ensureMicromamba = async (cwd: string): Promise<void> => {
  if (await isMicromambaInstalled(cwd)) return
  await downloadMicromamba(cwd)
}
