import * as sh from 'shelljs';
import * as path from 'path';
import {
  downloadMicromambaLinux,
  downloadMicromambaMac,
  downloadMicromambaWin,
} from './downloadMicromamba';

const tmpDir = path.join(__dirname, 'tmp', path.basename(__filename));

describe('downloadMicromamba', () => {
  beforeEach(() => {
    sh.rm('-rf', tmpDir);
    sh.mkdir('-p', tmpDir);
  });

  it('win32', async () => {
    await downloadMicromambaWin(tmpDir);
    const actual = sh.ls(tmpDir).toString();
    expect(actual).toBe('micromamba.exe');
  }, 10000);

  it('linux', async () => {
    await downloadMicromambaMac(tmpDir);
    const actual = sh.ls(tmpDir).toString();
    expect(actual).toBe('micromamba');
  }, 10000);

  it('darwin', async () => {
    await downloadMicromambaLinux(tmpDir);
    const actual = sh.ls(tmpDir).toString();
    expect(actual).toBe('micromamba');
  }, 10000);
});
