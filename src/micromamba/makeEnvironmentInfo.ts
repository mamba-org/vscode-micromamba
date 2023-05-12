import { ExtensionContext, OutputChannel, WorkspaceFolder, window } from "vscode";
import { Signals, makeSignals } from "./makeSignals";
import { combineLatest, concatMap, shareReplay } from "rxjs";
import { makeMicromambaInfo } from "./makeMicromambaInfo";
import { getMicromambaEnvVariables } from "./getMicromambaEnvVariables";
import { EnvironmentFailed, EnvironmentOK } from "./_definitions";

interface Props {
  ch: OutputChannel
  signals: Signals
  environmentName: string | undefined
  workspaceFolder: WorkspaceFolder
  globalHomeDir: string | undefined
}

export async function _makeEnvironmentInfo({ workspaceFolder, globalHomeDir, environmentName, signals, ch }: Props) {
  const info = makeMicromambaInfo({ workspaceFolder, globalHomeDir })
  const common = {
    ch,
    signals,
    info,
    environmentName,
  }
  if (!environmentName) return {
    ...common,
    ok: false,
  } as EnvironmentFailed
  try {
    return {
      ...common,
      vars: await getMicromambaEnvVariables(info, environmentName),
      ok: true,
    } as EnvironmentOK
  } catch (ignore) {
    window.showErrorMessage(`Micromamba can't create ${environmentName} environment`)
    return {
      ...common,
      ok: false,
    } as EnvironmentFailed
  }
}

export function makeEnvironmentInfo(ctx: ExtensionContext, workspaceFolder: WorkspaceFolder) {
  const ch = window.createOutputChannel('Micromamba')
  const signals = makeSignals(ctx)
  return combineLatest([signals.globalHomeDir.values$, signals.activeEnvironmentName.values$]).pipe(
    concatMap(async ([globalHomeDir, environmentName]) => _makeEnvironmentInfo({
      ch,
      workspaceFolder,
      globalHomeDir,
      environmentName,
      signals,
    })),
    shareReplay(1)
  )
}
