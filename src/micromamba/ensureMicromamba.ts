import * as path from 'path';
import { spawnSync } from 'child_process';
import { downloadMicromamba } from './downloadMicromamba';

export const isMicromambaInstalled = (cwd: string): boolean => {
  const pathKey = Object.keys(process.env).find((x) => x.toLowerCase() === 'path');
  const env: NodeJS.ProcessEnv = { ...process.env };
  env[pathKey] = [cwd, env[pathKey]].join(path.delimiter);
  const res = spawnSync('micromamba', { cwd, encoding: 'utf8', env });
  if (res.error) {
    console.error(res.error.message);
    return false;
  }
  if (res.status !== 0) {
    console.log(res.stdout);
    console.error(res.stderr);
    console.error('status', res.status);
    return false;
  }
  if (res.stdout.length) return true;
  return false;
};

export const ensureMicromamba = async (cwd: string): Promise<void> => {
  if (isMicromambaInstalled(cwd)) return;
  await downloadMicromamba(cwd);
};
