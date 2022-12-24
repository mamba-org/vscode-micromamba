import { CommandLike } from './_definitions'

export const runDeactivateEnvironmentCommand: CommandLike = async ({ manager }) => {
  manager.deactivate()
}
