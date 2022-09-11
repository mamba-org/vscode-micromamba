import * as path from 'path';
import * as sh from 'shelljs';
import { downloadMicromamba } from './downloadMicromamba';

export const _isMicromambaInstalled = (path: string): boolean => {
  return sh.test('-f', path);
};

export const isMicromambaInstalledWin = (cwd: string): boolean => {
  return _isMicromambaInstalled(path.join(cwd, 'micromamba.exe'));
};

export const isMicromambaInstalledMac = (cwd: string): boolean => {
  return _isMicromambaInstalled(path.join(cwd, 'micromamba'));
};

export const isMicromambaInstalledLinux = (cwd: string): boolean => {
  return _isMicromambaInstalled(path.join(cwd, 'micromamba'));
};

export const isMicromambaInstalled = (cwd: string): boolean => {
  switch (process.platform) {
    case 'linux':
      return isMicromambaInstalledLinux(cwd);
    case 'win32':
      return isMicromambaInstalledWin(cwd);
    case 'darwin':
      return isMicromambaInstalledMac(cwd);
    default:
      throw new Error(`Unsuported platform ${process.platform}`);
  }
};

export const ensureMicromamba = async (cwd: string): Promise<void> => {
  if (isMicromambaInstalled(cwd)) return;
  await downloadMicromamba(cwd);
};
