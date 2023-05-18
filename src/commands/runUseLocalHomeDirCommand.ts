import { CommandLike } from './_definitions'
import { askToReloadWindow } from './helpers'

export const runUseLocalHomeDirCommand: CommandLike = async ({ signals }) => {
  signals.activeEnvironmentInput.set(undefined)
  signals.globalHomeDir.set(undefined)
  askToReloadWindow()
}
