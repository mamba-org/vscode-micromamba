import * as path from 'path';
import { execSync } from 'child_process';

const getEnvPath = (): string => {
  const pathKey = Object.keys(process.env).find((x) => x.toUpperCase() === 'PATH');
  const pathValue = process.env[pathKey];
  return pathValue;
};

export const getMicromambaEnvVariables = (options: {
  micromambaDir: string;
  micromambaPath: string;
}): { name: string; value: string }[] => {
  const { micromambaDir, micromambaPath } = options;
  const envPath = getEnvPath();
  const envs = execSync('micromamba shell activate -s bash -p default', {
    encoding: 'utf-8',
    env: {
      PATH: [micromambaDir, envPath].join(path.delimiter),
      MAMBA_ROOT_PREFIX: micromambaDir,
      MAMBA_EXE: micromambaPath,
    },
  })
    .split('\r\n')
    .join('\n')
    .split('\n')
    .filter((x) => x.startsWith('export '))
    .map((x) => x.replace('export ', ''))
    .map((x) => x.split('='))
    .map((x) => {
      const name = x[0];
      const value = x[1].slice(1, -1);
      return { name, value };
    });
  return envs;
};
