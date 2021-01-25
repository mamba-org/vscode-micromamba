import { isWindows } from './infra';
import {
  parseMicromambaShellActivateResponseWin,
  parseMicromambaShellActivateResponseNonWin,
  getMicromambaEnvVariables,
  getMicromambaEnvVariablesNonWin,
  getMicromambaEnvVariablesWin,
} from './getMicromambaEnvVariables';

describe('parseMicromambaShellActivateResponse', () => {
  it('parseMicromambaShellActivateResponseWin', () => {
    const res = `
$Env:PATH = "c:\\test\\.micromamba"
$Env:CONDA_PREFIX = "c:\\test\\.micromamba"
$Env:CONDA_SHLVL = "1"
$Env:CONDA_DEFAULT_ENV = "base"
$Env:CONDA_PROMPT_MODIFIER = "(base) "`;
    const vars = parseMicromambaShellActivateResponseWin(res);
    expect(vars).toEqual([
      { name: 'PATH', value: 'c:\\test\\.micromamba' },
      { name: 'CONDA_PREFIX', value: 'c:\\test\\.micromamba' },
      { name: 'CONDA_SHLVL', value: '1' },
      { name: 'CONDA_DEFAULT_ENV', value: 'base' },
      { name: 'CONDA_PROMPT_MODIFIER', value: '(base) ' },
    ]);
  });
  it('parseMicromambaShellActivateResponseNonWin', () => {
    const res = `
export PATH='/home/test/.micromamba'
export CONDA_PREFIX='/home/test/.micromamba'
export CONDA_SHLVL='1'
export CONDA_DEFAULT_ENV='base'
export CONDA_PROMPT_MODIFIER='(base) '`;
    const vars = parseMicromambaShellActivateResponseNonWin(res);
    expect(vars).toEqual([
      { name: 'PATH', value: '/home/test/.micromamba' },
      { name: 'CONDA_PREFIX', value: '/home/test/.micromamba' },
      { name: 'CONDA_SHLVL', value: '1' },
      { name: 'CONDA_DEFAULT_ENV', value: 'base' },
      { name: 'CONDA_PROMPT_MODIFIER', value: '(base) ' },
    ]);
  });
  it('getMicromambaEnvVariables', () => {
    const expected = isWindows ? getMicromambaEnvVariablesWin : getMicromambaEnvVariablesNonWin;
    expect(getMicromambaEnvVariables).toBe(expected);
  });
});
