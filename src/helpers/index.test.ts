import * as sh from 'shelljs';
import * as path from 'path';
import { ensureMicromamba } from './ensureMicromamba';
import { create, help } from './micromamba';
import { isMicromambaInstalled } from './isMicromambaInstalled';
import { getMicromambaEnvVariables } from './getMicromambaEnvVariables';
import { isWindows } from './infra';

const tmpDir = path.join(__dirname, 'tmp', path.basename(__filename));

beforeEach(() => {
  sh.rm('-rf', tmpDir);
  sh.mkdir('-p', tmpDir);
  sh.pushd('-q', tmpDir);
});

afterEach(() => {
  sh.popd('-q');
});

it('scenario1', async () => {
  expect(isMicromambaInstalled(tmpDir)).toBeFalsy();
  await ensureMicromamba(tmpDir);
  expect(isMicromambaInstalled(tmpDir)).toBeTruthy();
  const resx = help(tmpDir);
  expect(resx).not.toBe('');
  sh.ShellString(
    `
name: mamba
channels:
  - conda-forge
dependencies:
  - nodejs

`
  ).to('mamba.yaml');
  create({ micromambaDir: tmpDir, micromambaYamlPath: 'mamba.yaml' });
  const actual = sh.ls();
  expect(actual).toContain('envs');
  const varNames = getMicromambaEnvVariables({
    micromambaDir: tmpDir,
    micromambaPath: path.join(tmpDir, isWindows ? 'micromamba.exe' : 'micromamba'),
  }).map((x) => x.name);
  expect(varNames).toContain('CONDA_PREFIX');
  expect(varNames).toContain('CONDA_SHLVL');
  expect(varNames).toContain('CONDA_DEFAULT_ENV');
  expect(varNames).toContain('CONDA_PROMPT_MODIFIER');
  expect(varNames).toContain('MAMBA_ROOT_PREFIX');
  expect(varNames).toContain('MAMBA_EXE');
  expect(varNames).toContain('PATH');
}, 100000);
