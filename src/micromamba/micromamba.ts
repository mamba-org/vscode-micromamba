import * as path from 'path';
import { spawnSync } from 'child_process';

export const makeEnv = (micromambaDir: string): NodeJS.ProcessEnv => {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    MAMBA_ROOT_PREFIX: micromambaDir,
  };
  const pathKey = Object.keys(env).find((x) => x.toLowerCase() === 'path') as string;
  env[pathKey] = [micromambaDir, env[pathKey]].join(path.delimiter);
  return env;
};

export const micromamba = (options: {
  cwd?: string;
  args: string[];
  micromambaDir: string;
}): string => {
  const { cwd, args, micromambaDir } = options;
  const env = makeEnv(micromambaDir);
  const res = spawnSync('micromamba', args, { cwd, encoding: 'utf8', env });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(res.stderr);
  return res.stdout;
};

export const help = (micromambaPath: string): string => {
  const args = ['create', '-h'];
  return micromamba({ micromambaDir: micromambaPath, args });
};

export const create = (options: { micromambaDir: string; micromambaYamlPath: string }): string => {
  const { micromambaDir, micromambaYamlPath } = options;
  const args = ['create', '--file', micromambaYamlPath, '--yes'];
  return micromamba({ micromambaDir, args });
};
