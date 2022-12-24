import * as vscode from 'vscode'
import { join } from 'path'
import { readMicromambaEnvironmentFiles } from './pickMicromambaEnvironmentFile'
import { ExtensionContext } from '../_definitions'
import { MicromambaEnvironmentFile } from './_definitions'
import sh from '../helpers/sh'

export type MicromambaEnvironmentQuickPickItem = {
  label: string
  description: string
  data: MicromambaEnvironmentFile
}

const mapToQuickPickItems = (
  files: MicromambaEnvironmentFile[],
  prefixNames: string[],
): MicromambaEnvironmentQuickPickItem[] => {
  return files
    .filter((x) => prefixNames.find((p) => p === x.content.name))
    .map((data) => ({
      label: data.fileName,
      description: `[${data.content.name}]`,
      data,
    }))
}

export const findMicromambaEnvironmentQuickPickItems = async (
  extContext: ExtensionContext,
): Promise<MicromambaEnvironmentQuickPickItem[]> => {
  const names = await readMicromambaEnvironmentPrefixNames(extContext)
  const files = await readMicromambaEnvironmentFiles(extContext)
  return mapToQuickPickItems(files, names)
}

export const readMicromambaEnvironmentPrefixNames = async (
  extContext: ExtensionContext,
): Promise<string[]> => {
  const envsPath = join(extContext.micromambaDir, 'envs')
  return (await sh.testd(envsPath)) ? await sh.ls(envsPath) : []
}

export const pickMicromambaEnvironmentPrefixName = async (
  extContext: ExtensionContext,
  placeHolder: string,
): Promise<string | undefined> => {
  const items = await findMicromambaEnvironmentQuickPickItems(extContext)
  switch (items.length) {
    case 0:
      return undefined
    case 1:
      return items[0].data.content.name
    default: {
      const item = await vscode.window.showQuickPick(items, { placeHolder })
      return item ? item.data.content.name : undefined
    }
  }
}
