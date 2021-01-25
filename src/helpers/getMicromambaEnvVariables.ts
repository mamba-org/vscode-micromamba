import * as path from 'path';
import { execSync } from 'child_process';
import { isWindows, pathKey } from './infra';

export const parseMicromambaShellActivateResponseWin = (
  res: string
): { name: string; value: string }[] =>
  res
    .split('\r\n')
    .join('\n')
    .split('\n')
    .filter((x) => x.startsWith('$Env:'))
    .map((x) => x.replace('$Env:', ''))
    .map((x) => x.split(' = '))
    .map((x) => {
      const name = x[0];
      const value = x[1].slice(1, -1);
      return { name, value };
    });

export const getMicromambaEnvVariablesWin = (options: {
  micromambaDir: string;
  micromambaPath: string;
}): { name: string; value: string }[] => {
  const { micromambaDir, micromambaPath } = options;
  const envPath = process.env[pathKey];
  const res = execSync('micromamba shell activate -s powershell -p default', {
    encoding: 'utf-8',
    env: {
      PATH: [micromambaDir, envPath].join(path.delimiter),
      MAMBA_ROOT_PREFIX: micromambaDir,
      MAMBA_EXE: micromambaPath,
    },
  });
  return parseMicromambaShellActivateResponseWin(res);
};

export const parseMicromambaShellActivateResponseNonWin = (
  res: string
): { name: string; value: string }[] =>
  res
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

export const getMicromambaEnvVariablesNonWin = (options: {
  micromambaDir: string;
  micromambaPath: string;
}): { name: string; value: string }[] => {
  const { micromambaDir, micromambaPath } = options;
  const envPath = process.env[pathKey];
  const res = execSync('micromamba shell activate -s bash -p default', {
    encoding: 'utf-8',
    env: {
      PATH: [micromambaDir, envPath].join(path.delimiter),
      MAMBA_ROOT_PREFIX: micromambaDir,
      MAMBA_EXE: micromambaPath,
    },
  });
  return parseMicromambaShellActivateResponseNonWin(res);
};

export const getMicromambaEnvVariables = isWindows
  ? getMicromambaEnvVariablesWin
  : getMicromambaEnvVariablesNonWin;
