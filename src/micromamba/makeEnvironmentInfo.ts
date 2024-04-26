import { ExtensionContext, OutputChannel, WorkspaceFolder, window } from "vscode";
import { EnvironmentParams, Signals, makeSignals } from "./makeSignals";
import { combineLatest, concatMap, shareReplay } from "rxjs";
import { makeMicromambaParams } from "./makeMicromambaParams";
import { getMicromambaEnvVariables } from "./getMicromambaEnvVariables";
import { EnvironmentFailed, EnvironmentOK } from "./_definitions";
import { isNativeError } from "util/types";

interface Props {
  ch: OutputChannel
  signals: Signals
  environmentParams: EnvironmentParams
  workspaceFolder: WorkspaceFolder
  globalHomeDir: string | undefined
}

export async function _makeEnvironmentInfo({ workspaceFolder, globalHomeDir, environmentParams, signals, ch }: Props) {
  const micromambaParams = makeMicromambaParams({ workspaceFolder, globalHomeDir })
  const common = {
    ch,
    signals,
    params: {
      micromambaParams,
      environmentParams,
    }
  }
  if (environmentParams === undefined) return {
    ...common,
    ok: false,
  } as EnvironmentFailed
  try {
    return {
      ...common,
      vars: await getMicromambaEnvVariables({ micromambaParams, environmentParams }),
      ok: true,
    } as EnvironmentOK
  } catch (err) {
    if (isNativeError(err)) {
      ch?.appendLine('Error: ' + err.message)
      ch?.appendLine('Stack: ' + err.stack)
    } else {
      ch?.appendLine('Error: ' + err)
    }
    ch?.show(true)
    window.showErrorMessage(`Micromamba can't create ${environmentParams.name} environment`)
    return {
      ...common,
      ok: false,
    } as EnvironmentFailed
  }
}

export function makeEnvironmentInfo(ctx: ExtensionContext, workspaceFolder: WorkspaceFolder) {
  const ch = window.createOutputChannel('Micromamba')
  const signals = makeSignals(ctx)
  return combineLatest([signals.globalHomeDir.values$, signals.activeEnvironmentInput.values$]).pipe(
    concatMap(async ([globalHomeDir, environmentName]) => _makeEnvironmentInfo({
      ch,
      workspaceFolder,
      globalHomeDir,
      environmentParams: environmentName,
      signals,
    })),
    shareReplay(1)
  )
}
