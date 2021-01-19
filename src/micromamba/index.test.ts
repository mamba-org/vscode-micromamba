import * as sh from 'shelljs';
import * as path from 'path';
import { ensureMicromamba, isMicromambaInstalled } from './ensureMicromamba';
import { create, help } from './micromamba';

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
}, 100000);
