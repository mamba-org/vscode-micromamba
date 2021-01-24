import * as path from 'path';
import { https } from 'follow-redirects';
import { Writable } from 'stream';
import * as tar from 'tar';
import * as bz2 from 'unbzip2-stream';
import * as sh from 'shelljs';

export const _downloadMicromamba = (url: string, tar: Writable): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      const req = https.get(url, (res) => res.pipe(bz2()).pipe(tar));
      req.on('error', (err) => reject(err));
      tar.on('error', (err) => reject(err));
      tar.on('finish', () => resolve());
    } catch (err) {
      reject(err);
    }
  });
};

export const downloadMicromambaWin = async (cwd: string): Promise<void> => {
  const url = 'https://micromamba.snakepit.net/api/micromamba/win-64/latest';
  const stream = tar.x({ cwd, strip: 2 }, ['Library/bin/micromamba.exe']);
  await _downloadMicromamba(url, stream);
};

export const downloadMicromambaMac = async (cwd: string): Promise<void> => {
  const url = 'https://micromamba.snakepit.net/api/micromamba/osx-64/latest';
  const stream = tar.x({ cwd, strip: 1 }, ['bin/micromamba']);
  await _downloadMicromamba(url, stream);
  sh.chmod('-R', '+x', cwd);
  sh.chmod('+rx', path.join(cwd, 'micromamba'));
};

export const downloadMicromambaLinux = async (cwd: string): Promise<void> => {
  const url = 'https://micromamba.snakepit.net/api/micromamba/linux-64/latest';
  const stream = tar.x({ cwd, strip: 1 }, ['bin/micromamba']);
  await _downloadMicromamba(url, stream);
  sh.chmod('-R', '+x', cwd);
  sh.chmod('+rx', path.join(cwd, 'micromamba'));
};

export const downloadMicromamba = (() => {
  switch (process.platform) {
    case 'linux':
      return downloadMicromambaLinux;
    case 'win32':
      return downloadMicromambaWin;
    case 'darwin':
      return downloadMicromambaMac;
    default:
      throw new Error(`Unsuported platform ${process.platform}`);
  }
})();
