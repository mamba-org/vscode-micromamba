import * as path from 'path'
import { spawnSync } from 'child_process'
import mockos from 'mock-os'
import { platform } from 'os'
import sh from '../sh'
import {
  downloadMicromambaLinux,
  downloadMicromambaMac,
  downloadMicromambaWin,
} from './downloadMicromamba'

const tmpDir = path.join(__dirname, 'tmp', path.basename(__filename))

describe('downloadMicromamba', () => {
  beforeEach(async () => {
    mockos.restore()
    await sh.rmrf(tmpDir)
    await sh.mkdirp(tmpDir)
  })
  afterEach(() => {
    mockos.restore()
  })

  it('win32', async () => {
    await downloadMicromambaWin(tmpDir)
    const actual = await sh.ls(tmpDir)
    expect(actual).toEqual(['micromamba.exe'])
  }, 10000)

  it('linux', async () => {
    await downloadMicromambaLinux(tmpDir)
    const actual = await sh.ls(tmpDir)
    expect(actual).toEqual(['micromamba'])
  }, 10000)

  const getFileInfo = (filePath: string) => {
    const res = spawnSync('file', [filePath], { encoding: 'utf8' })
    expect(res.error).toBeUndefined()
    expect(res.status).toEqual(0)
    return res.stdout
  }

  it('darwin-x64', async () => {
    mockos({ arch: 'x64' })
    await downloadMicromambaMac(tmpDir)
    const actual = await sh.ls(tmpDir)
    expect(actual).toEqual(['micromamba'])

    if (platform() == 'darwin') {
      expect(getFileInfo(path.join(tmpDir, 'micromamba'))).toContain(
        'Mach-O 64-bit executable x86_64',
      )
    }
  }, 10000)

  it('darwin-arm64', async () => {
    mockos({ arch: 'arm64' })
    await downloadMicromambaMac(tmpDir)
    const actual = await sh.ls(tmpDir)
    expect(actual).toEqual(['micromamba'])
    if (platform() == 'darwin') {
      expect(getFileInfo(path.join(tmpDir, 'micromamba'))).toContain(
        'Mach-O 64-bit executable arm64',
      )
    }
  }, 10000)
})
