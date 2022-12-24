import { runActivateEnvironmentCommand } from './runActivateEnvironmentCommand'
import { runClearAllCommand } from './runClearAllCommand'
import { runCreateEnvironmentCommand } from './runCreateEnvironmentCommand'
import { runDeactivateEnvironmentCommand } from './runDeactivateEnvironmentCommand'
import { runRemoveEnvironmentCommand } from './runRemoveEnvironmentCommand'
import { CommandLike } from './_definitions'

export type CommandInfo = [string, CommandLike]

export const commands: Array<CommandInfo> = [
  ['corker.micromamba.create.environment', runCreateEnvironmentCommand],
  ['corker.micromamba.activate.environment', runActivateEnvironmentCommand],
  ['corker.micromamba.deactivate.environment', runDeactivateEnvironmentCommand],
  ['corker.micromamba.remove.environment', runRemoveEnvironmentCommand],
  ['corker.micromamba.clear.all', runClearAllCommand],
]
