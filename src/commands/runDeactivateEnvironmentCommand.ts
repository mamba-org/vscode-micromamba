import { CommandLike } from './_definitions'
import { askToReloadWindow } from './helpers'

export const runDeactivateEnvironmentCommand: CommandLike = async ({ signals }) => {
  signals.activeEnvironmentName.set(undefined)
  askToReloadWindow()
}
