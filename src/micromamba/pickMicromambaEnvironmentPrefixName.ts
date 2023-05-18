import { readMicromambaEnvironmentFiles } from './pickMicromambaEnvironmentFile'
import { MicromambaEnvironmentFile } from './_definitions'
import sh from '../sh'
import { window } from 'vscode'
import { MicromambaParams } from './makeMicromambaParams'

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
  info: MicromambaParams,
): Promise<MicromambaEnvironmentQuickPickItem[]> => {
  const names = await readMicromambaEnvironmentPrefixNames(info)
  const files = await readMicromambaEnvironmentFiles(info)
  return mapToQuickPickItems(files, names)
}

export const readMicromambaEnvironmentPrefixNames = async (
  info: MicromambaParams,
): Promise<string[]> => {
  return (await sh.testd(info.envsDir)) ? await sh.ls(info.envsDir) : []
}

export const pickMicromambaEnvironmentPrefixName = async (
  info: MicromambaParams,
  placeHolder: string,
): Promise<string | undefined> => {
  const items = await findMicromambaEnvironmentQuickPickItems(info)
  switch (items.length) {
    case 0:
      return undefined
    case 1:
      return items[0].data.content.name
    default: {
      const item = await window.showQuickPick(items, { placeHolder })
      return item ? item.data.content.name : undefined
    }
  }
}
