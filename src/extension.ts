import {
  activateCommands,
  activateContextFlags,
  activateDotEnvFile,
  activateStatusBarItem,
  activateTerminal,
} from './activations'
import { activateProcessEnv, initProcessEnv } from './activations/activateProcessEnv'
import { ExtensionContext, window, workspace } from 'vscode'
import { makeEnvironmentInfo } from './micromamba/makeEnvironmentInfo'

export function activate(ctx: ExtensionContext): void {
  if (!workspace.workspaceFolders) {
    window.showInformationMessage('micromamba: Open a folder or a workspace')
    return
  }
  initProcessEnv(ctx, workspace.workspaceFolders[0])
  const info$ = makeEnvironmentInfo(ctx, workspace.workspaceFolders[0])
  ctx.subscriptions.push(
    activateCommands(info$),
    activateStatusBarItem(info$),
    activateDotEnvFile(info$),
    activateTerminal(info$, ctx),
    activateProcessEnv(info$),
    activateContextFlags(info$),
  )
}

export function deactivate(): void {
  /* noop */
}
