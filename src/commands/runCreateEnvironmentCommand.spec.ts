import { basename, join } from 'path'
import { EnvironmentInfo, getMicromambaEnvVariables } from '../micromamba'
import { runCreateEnvironmentCommand } from './runCreateEnvironmentCommand'
import sh from '../sh'
import { makeMicromambaInfo } from '../micromamba/makeMicromambaInfo'
import { WorkspaceFolder } from 'vscode'
import { isWindows } from '../infra'
import { execSync } from 'child_process'

jest.mock('vscode', () => ({
  window: {
    showErrorMessage: (message: string) => {
      throw new Error(message)
    },
    showInformationMessage: jest.fn(),
    withProgress: (_: unknown, task: (progress: unknown) => Promise<void>) => {
      const progress = {
        report: jest.fn(),
      }
      return task(progress)
    },
  },
  ProgressLocation: {},
}))

const tmpDir = join(__dirname, 'tmp', basename(__filename))
const globalHomeDir = join(tmpDir, 'home')
const workspaceDir = join(tmpDir, 'workspace')
const workspaceFolder = { uri: { fsPath: workspaceDir } } as unknown as WorkspaceFolder

beforeEach(async () => {
  await sh.rmrf(tmpDir)
  await sh.mkdirp(globalHomeDir)
  await sh.mkdirp(workspaceDir)
  await sh.writeFile(
    join(workspaceDir, 'environment.yml'),
    `
name: mamba
channels:
  - conda-forge
dependencies:
  - nodejs
`,
  )
})

it('with global home dir', async () => {
  const ch = {}
  const signals = {
    activeEnvironmentName: { set: jest.fn() },
  }
  const info = makeMicromambaInfo({ workspaceFolder, globalHomeDir })
  await runCreateEnvironmentCommand({
    ch,
    info,
    signals,
  } as unknown as EnvironmentInfo)
  expect(await sh.ls(globalHomeDir)).toStrictEqual([
    'envs',
    isWindows ? 'micromamba.exe' : 'micromamba',
    'pkgs',
  ])
  expect({
    envsDir: await sh.ls(info.envsDir),
    workspaceDir: await sh.ls(info.workspaceDir),
    workspaceMicromambaDir: await sh.ls(info.workspaceMicromambaDir),
  }).toMatchInlineSnapshot(`
    {
      "envsDir": [
        "mamba",
      ],
      "workspaceDir": [
        ".micromamba",
        "environment.yml",
      ],
      "workspaceMicromambaDir": [
        ".gitignore",
      ],
    }
  `)
  const vars = await getMicromambaEnvVariables(info, 'mamba')
  const env = Object.fromEntries(vars.map((x) => [x.name, x.value]))
  expect(() => execSync('node --version', { env, encoding: 'utf8' })).not.toThrow()
}, 100000)

it('with local home dir', async () => {
  const ch = {}
  const signals = {
    activeEnvironmentName: { set: jest.fn() },
  }
  const info = makeMicromambaInfo({ workspaceFolder, globalHomeDir: undefined })
  await runCreateEnvironmentCommand({
    ch,
    info,
    signals,
  } as unknown as EnvironmentInfo)
  expect(await sh.ls(info.workspaceMicromambaDir)).toStrictEqual([
    '.gitignore',
    'envs',
    isWindows ? 'micromamba.exe' : 'micromamba',
    'pkgs',
  ])
  expect({
    envsDir: await sh.ls(info.envsDir),
    globalHomeDir: await sh.ls(globalHomeDir),
    workspaceDir: await sh.ls(info.workspaceDir),
  }).toMatchInlineSnapshot(`
    {
      "envsDir": [
        "mamba",
      ],
      "globalHomeDir": [],
      "workspaceDir": [
        ".micromamba",
        "environment.yml",
      ],
    }
  `)
  const vars = await getMicromambaEnvVariables(info, 'mamba')
  const env = Object.fromEntries(vars.map((x) => [x.name, x.value]))
  expect(() => execSync('node --version', { env, encoding: 'utf8' })).not.toThrow()
}, 100000)
