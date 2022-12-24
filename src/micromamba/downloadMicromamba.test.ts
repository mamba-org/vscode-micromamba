import * as path from 'path'
import sh from '../helpers/sh'
import {
  downloadMicromambaLinux,
  downloadMicromambaMac,
  downloadMicromambaWin,
} from './downloadMicromamba'

const tmpDir = path.join(__dirname, 'tmp', path.basename(__filename))

describe('downloadMicromamba', () => {
  beforeEach(async () => {
    await sh.rmrf(tmpDir)
    await sh.mkdirp(tmpDir)
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

  it('darwin', async () => {
    await downloadMicromambaMac(tmpDir)
    const actual = await sh.ls(tmpDir)
    expect(actual).toEqual(['micromamba'])
  }, 10000)
})
