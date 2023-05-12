import { pickMicromambaEnvironmentPrefixName } from '../micromamba'
import { CommandLike } from './_definitions'
import { askToReloadWindow } from './helpers'

export const runActivateEnvironmentCommand: CommandLike = async ({ info, signals }) => {
  const placeHolder = 'Select environment to activate'
  const prefixName = await pickMicromambaEnvironmentPrefixName(info, placeHolder)
  if (prefixName) {
    signals.activeEnvironmentName.set(prefixName)
    askToReloadWindow()
  }
}
