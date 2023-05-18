import { ExtensionContext, WorkspaceFolder } from 'vscode'
import { makeEnvironmentInfo } from './makeEnvironmentInfo'
import { firstValueFrom } from 'rxjs'
import { join } from 'path'
import { isWindows } from '../infra'

jest.mock('vscode', () => ({
  window: {
    createOutputChannel: jest.fn(),
    showErrorMessage: jest.fn(),
  },
}))

const baseDir = isWindows ? 'c:/basedir' : '/basedir'
const homeDir = join(baseDir, 'home')
const workspaceDir = join(baseDir, 'workspace')

const globalStateGetMock = jest.fn()

const ctx = {
  workspaceState: {
    get: jest.fn(() => 'default'),
  },
  globalState: {
    get: globalStateGetMock,
  },
} as unknown as ExtensionContext

const workspaceFolder = {
  uri: { fsPath: workspaceDir },
} as WorkspaceFolder

it('with global home dir', async () => {
  globalStateGetMock.mockImplementation(() => homeDir)
  const info$ = makeEnvironmentInfo(ctx, workspaceFolder)
  const info = await firstValueFrom(info$)
  expect(info.params.environmentParams?.name).toMatchInlineSnapshot(`"default"`)
  if (isWindows) {
    expect(info.params.micromambaParams).toMatchInlineSnapshot(`
      {
        "envsDir": "c:\\basedir\\home\\envs\\88933f0e",
        "isLocal": false,
        "mambaExe": "c:\\basedir\\home\\micromamba.exe",
        "mambaRootPrefix": "c:\\basedir\\home",
        "workspaceDir": "c:\\basedir\\workspace",
        "workspaceMicromambaDir": "c:\\basedir\\workspace\\.micromamba",
      }
    `)
  } else {
    expect(info.params.micromambaParams).toMatchInlineSnapshot(`
      {
        "envsDir": "/basedir/home/envs/8e100a88",
        "isLocal": false,
        "mambaExe": "/basedir/home/micromamba",
        "mambaRootPrefix": "/basedir/home",
        "workspaceDir": "/basedir/workspace",
        "workspaceMicromambaDir": "/basedir/workspace/.micromamba",
      }
    `)
  }
  expect(info.ok).toMatchInlineSnapshot(`false`)
})

it('with local home dir', async () => {
  globalStateGetMock.mockImplementation(() => undefined)
  const info$ = makeEnvironmentInfo(ctx, workspaceFolder)
  const info = await firstValueFrom(info$)
  expect(info.params.environmentParams?.name).toMatchInlineSnapshot(`"default"`)
  if (isWindows) {
    expect(info.params.micromambaParams).toMatchInlineSnapshot(`
      {
        "envsDir": "c:\\basedir\\workspace\\.micromamba\\envs",
        "isLocal": true,
        "mambaExe": "c:\\basedir\\workspace\\.micromamba\\micromamba.exe",
        "mambaRootPrefix": "c:\\basedir\\workspace\\.micromamba",
        "workspaceDir": "c:\\basedir\\workspace",
        "workspaceMicromambaDir": "c:\\basedir\\workspace\\.micromamba",
      }
    `)
  } else {
    expect(info.params.micromambaParams).toMatchInlineSnapshot(`
      {
        "envsDir": "/basedir/workspace/.micromamba/envs",
        "isLocal": true,
        "mambaExe": "/basedir/workspace/.micromamba/micromamba",
        "mambaRootPrefix": "/basedir/workspace/.micromamba",
        "workspaceDir": "/basedir/workspace",
        "workspaceMicromambaDir": "/basedir/workspace/.micromamba",
      }
    `)
  }
  expect(info.ok).toMatchInlineSnapshot(`false`)
})
