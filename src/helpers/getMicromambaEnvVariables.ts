import * as fs from 'fs';
import * as path from 'path';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import { isWindows, pathKey } from './infra';

export const parseMicromambaShellActivateResponse = (
  res: string
): { name: string; value: string }[] =>
  res
    .split('\r\n')
    .join('\n')
    .split('\n')
    .map((x) => x.split('='))
    .filter((x) => x.length === 2)
    .map((x) => {
      const name = x[0];
      const value = x[1];
      return { name, value };
    });

const getExecOptions = (
  micromambaDir: string,
  micromambaPath: string
): ExecSyncOptionsWithStringEncoding => ({
  encoding: 'utf-8' as BufferEncoding,
  env: {
    PATH: [micromambaDir, process.env[pathKey]].join(path.delimiter),
    MAMBA_ROOT_PREFIX: micromambaDir,
    MAMBA_EXE: micromambaPath,
  } as NodeJS.ProcessEnv,
});

export const getMicromambaEnvVariablesWin = (options: {
  micromambaDir: string;
  micromambaPath: string;
}): { name: string; value: string }[] => {
  const { micromambaDir, micromambaPath } = options;
  const execOptions = getExecOptions(micromambaDir, micromambaPath);
  const cmdFilePath = execSync('micromamba shell activate -s cmd.exe -p default', execOptions);
  fs.appendFileSync(cmdFilePath, '\r\nset');
  const res = execSync(cmdFilePath, execOptions);
  fs.unlinkSync(cmdFilePath);
  return parseMicromambaShellActivateResponse(res);
};

export const getMicromambaEnvVariablesNonWin = (options: {
  micromambaDir: string;
  micromambaPath: string;
}): { name: string; value: string }[] => {
  const { micromambaDir, micromambaPath } = options;
  const execOptions = getExecOptions(micromambaDir, micromambaPath);
  const bashActivateScript = execSync('micromamba shell activate -s bash -p default', execOptions);
  const bashScript = [bashActivateScript, 'env'].join('\n');
  const res = execSync(bashScript, execOptions);
  return parseMicromambaShellActivateResponse(res);
};

export const getMicromambaEnvVariables = isWindows
  ? getMicromambaEnvVariablesWin
  : getMicromambaEnvVariablesNonWin;
