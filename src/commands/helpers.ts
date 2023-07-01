import { commands, window } from "vscode"

async function _askToReloadWindow() {
  const action = 'Reload'
  const message = 'Micromamba: Reload VSCode window to apply changes'
  const result = await window.showInformationMessage(message, action)
  if (result === action) commands.executeCommand('workbench.action.reloadWindow')
}

export function askToReloadWindow() {
  void _askToReloadWindow().then()
}
