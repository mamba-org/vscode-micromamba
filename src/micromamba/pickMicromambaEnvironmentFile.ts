import { join } from 'path'
import { isWindows } from '../infra'
import * as fs from 'fs'
import * as YAML from 'yaml'
import { MicromambaEnvironmentFile, MicromambaEnvironmentFileContent } from './_definitions'
import sh from '../sh'
import { window } from 'vscode'
import { MicromambaInfo } from './makeMicromambaInfo'

const nodejs = `# Micromamba environment file
# https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba

name: default

channels:
  - conda-forge

dependencies:
  - nodejs
`

const go = `# Micromamba environment file
# https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba

name: default

channels:
  - conda-forge

dependencies:
  - go
`

const rust = `# Micromamba environment file
# https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba

name: default

channels:
  - conda-forge

dependencies:
  - rust
`

const python = `# Micromamba environment file
# https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba

name: default

channels:
  - conda-forge

dependencies:
  - python
`

const dotnet = `# Micromamba environment file
# https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba

name: default

channels:
  - conda-forge

dependencies:
  - dotnet
`

const jupyterlab = `# Micromamba environment file
# https://marketplace.visualstudio.com/items?itemName=corker.vscode-micromamba

name: default

channels:
  - conda-forge

dependencies:
  - jupyter-packaging
  - jupyterlab
  - nodejs
  - pytest
  - pytest-check-links
  - python
  - yarn
`

const templates: { [key: string]: string } = isWindows
  ? {
      nodejs,
      go,
      rust,
      python,
      dotnet,
      jupyterlab,
    }
  : {
      nodejs,
      go,
      rust,
      python,
      jupyterlab,
    }

const defaultFileName = 'environment.yml'

export const readMicromambaEnvironmentFile = async (
  extContext: MicromambaInfo,
  fileName: string,
): Promise<MicromambaEnvironmentFile | undefined> => {
  const filePath = join(extContext.workspaceDir, fileName)
  try {
    const contentYaml = await fs.promises.readFile(filePath, 'utf8')
    const content = YAML.parse(contentYaml) as MicromambaEnvironmentFileContent
    return { content, fileName, filePath }
  } catch (ignore) {
    return undefined
  }
}

export const readMicromambaEnvironmentFiles = async (
  extContext: MicromambaInfo,
): Promise<MicromambaEnvironmentFile[]> => {
  const fileNames = (await sh.ls(extContext.workspaceDir))
    .filter((x) => x === defaultFileName || x.toLowerCase().startsWith('environment'))
    .filter((x) => x.endsWith('.yml') || x.endsWith('.yaml'))
  const promises = fileNames.map((x) => readMicromambaEnvironmentFile(extContext, x))
  const environmentFiles = await Promise.all(promises)
  return environmentFiles.filter((x) => !!x).map((x) => x as MicromambaEnvironmentFile)
}

export const pickMicromambaEnvironmentFile = async (
  info: MicromambaInfo,
): Promise<MicromambaEnvironmentFile | undefined> => {
  const files = await readMicromambaEnvironmentFiles(info)
  switch (files.length) {
    case 0: {
      const placeHolder = 'Select an environment template'
      const key = await window.showQuickPick(Object.keys(templates), { placeHolder })
      if (key) {
        const content = templates[key]
        const environmentFilePath = join(info.workspaceDir, defaultFileName)
        await sh.writeFile(environmentFilePath, content)
        return await readMicromambaEnvironmentFile(info, defaultFileName)
      }
      return undefined
    }
    case 1:
      return files[0]
    default: {
      const placeHolder = 'Select an environment file'
      const items = files.map((data) => ({
        label: data.fileName,
        description: `[${data.content.name}]`,
        data,
      }))
      const item = await window.showQuickPick(items, { placeHolder })
      return item ? item.data : undefined
    }
  }
}
