import { pickMicromambaEnvironmentPrefixName } from '../micromamba'
import { CommandLike } from './_definitions'
import { askToReloadWindow } from './helpers'

export const runActivateEnvironmentCommand: CommandLike = async ({ params, signals }) => {
  const placeHolder = 'Select environment to activate'
  const name = await pickMicromambaEnvironmentPrefixName(params.micromambaParams, placeHolder)
  if (name) {
    signals.activeEnvironmentInput.set({ name, path: undefined })
    askToReloadWindow()
  }
}
