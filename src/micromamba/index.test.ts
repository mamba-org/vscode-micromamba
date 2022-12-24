import * as path from 'path'
import { ensureMicromamba, isMicromambaInstalled } from './ensureMicromamba'
import { create, help } from './micromamba'
import { getMicromambaEnvVariables } from './getMicromambaEnvVariables'
import { isWindows } from '../helpers/infra'
import { configureShellJS } from '../helpers/configureShellJS'
import { ExtensionContext } from '../_definitions'
import sh from '../helpers/sh'

const tmpDir = path.join(__dirname, 'tmp', path.basename(__filename))

configureShellJS({ micromambaDir: tmpDir } as ExtensionContext)

beforeEach(async () => {
  await sh.rmrf(tmpDir)
  await sh.mkdirp(tmpDir)
  process.chdir(tmpDir)
})

it('scenario1', async () => {
  const res1 = await isMicromambaInstalled(tmpDir)
  expect(res1).toBeFalsy()
  await ensureMicromamba(tmpDir)
  const res2 = await isMicromambaInstalled(tmpDir)
  expect(res2).toBeTruthy()
  const resx = help(tmpDir)
  expect(resx).not.toBe('')
  await sh.writeFile(
    'mamba.yaml',
    `
name: mamba
channels:
  - conda-forge
dependencies:
  - nodejs

`,
  )
  create({ micromambaDir: tmpDir, micromambaYamlPath: 'mamba.yaml' })
  const actual = await sh.ls(process.cwd())
  expect(actual).toContain('envs')
  const varNames = (
    await getMicromambaEnvVariables(
      {
        micromambaDir: tmpDir,
        micromambaPath: path.join(tmpDir, isWindows ? 'micromamba.exe' : 'micromamba'),
      },
      'mamba',
    )
  ).map((x) => x.name)
  expect(varNames).toContain('CONDA_PREFIX')
  expect(varNames).toContain('CONDA_SHLVL')
  expect(varNames).toContain('CONDA_DEFAULT_ENV')
  expect(varNames).toContain('CONDA_PROMPT_MODIFIER')
  expect(varNames).toContain('MAMBA_ROOT_PREFIX')
  expect(varNames).toContain('MAMBA_EXE')
  expect(varNames).toContain('PATH')
}, 100000)
