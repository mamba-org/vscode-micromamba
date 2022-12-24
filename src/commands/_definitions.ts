import { ActiveEnvironmentManager, ExtensionContext } from '../_definitions'

export type CommandLike = (context: CommandContext) => Promise<void>

export interface CommandContext {
  extContext: ExtensionContext
  manager: ActiveEnvironmentManager
}
