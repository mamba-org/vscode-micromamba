import { CommandLike } from './_definitions'
import { runActivateEnvironmentCommand } from './runActivateEnvironmentCommand'
import { runClearAllCommand } from './runClearAllCommand'
import { runCreateEnvironmentCommand } from './runCreateEnvironmentCommand'
import { runDeactivateEnvironmentCommand } from './runDeactivateEnvironmentCommand'
import { runRemoveEnvironmentCommand } from './runRemoveEnvironmentCommand'
import { runSelfUpdateCommand } from './runSelfUpdateCommand'
import { runUseGlobalHomeDirCommand } from './runUseGlobalHomeDirCommand'
import { runUseLocalHomeDirCommand } from './runUseLocalHomeDirCommand'
import { runActivateEnvironmentByPathCommand } from './runActivateEnvironmentByPathCommand'

export const commands: Array<[string, CommandLike]> = [
  ['corker.micromamba.create.environment', runCreateEnvironmentCommand],
  ['corker.micromamba.activate.environment', runActivateEnvironmentCommand],
  ['corker.micromamba.deactivate.environment', runDeactivateEnvironmentCommand],
  ['corker.micromamba.remove.environment', runRemoveEnvironmentCommand],
  ['corker.micromamba.clear.all', runClearAllCommand],
  ['corker.micromamba.use.global.home.dir', runUseGlobalHomeDirCommand],
  ['corker.micromamba.use.local.home.dir', runUseLocalHomeDirCommand],
  ['corker.micromamba.self.update', runSelfUpdateCommand],
  ['corker.micromamba.activate.environment.by.path', runActivateEnvironmentByPathCommand]
]
