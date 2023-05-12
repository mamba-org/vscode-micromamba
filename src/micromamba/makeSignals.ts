import { Subject, distinctUntilChanged, shareReplay, startWith } from "rxjs";
import { ExtensionContext } from "vscode";

export const GLOBAL_HOME_DIR_KEY = 'micromamba.global.home.dir'
export const ACTIVE_ENVIRONMENT_NAME_KEY = 'micromamba.active.environment.name'

export function readGlobalHomeDir(ctx: ExtensionContext) {
  return ctx.globalState.get<string>(GLOBAL_HOME_DIR_KEY);
}

export function readActiveEnvironmentName(ctx: ExtensionContext) {
  return ctx.workspaceState.get<string>(ACTIVE_ENVIRONMENT_NAME_KEY);
}

export function makeGlobalHomeDir(ctx: ExtensionContext) {
  const value = readGlobalHomeDir(ctx)
  const subject = new Subject<string | undefined>()
  const values$ = subject.pipe(startWith(value), distinctUntilChanged(), shareReplay(1))
  return {
    set(globalHomeDir: string | undefined) {
      void ctx.globalState.update(GLOBAL_HOME_DIR_KEY, globalHomeDir).then()
      subject.next(globalHomeDir)
    },
    values$
  }
}

export type GlobalHomeDir = ReturnType<typeof makeGlobalHomeDir>

export function makeActiveEnvironmentName(ctx: ExtensionContext) {
  const value = readActiveEnvironmentName(ctx)
  const subject = new Subject<string | undefined>()
  const values$ = subject.pipe(startWith(value), distinctUntilChanged(), shareReplay(1))
  return {
    set(activeEnvironmentName: string | undefined) {
      void ctx.workspaceState.update(ACTIVE_ENVIRONMENT_NAME_KEY, activeEnvironmentName).then()
      subject.next(activeEnvironmentName)
    },
    values$
  }
}

export type ActiveEnvironmentName = ReturnType<typeof makeActiveEnvironmentName>

export function makeSignals(ctx: ExtensionContext) {
  return {
    activeEnvironmentName: makeActiveEnvironmentName(ctx),
    globalHomeDir: makeGlobalHomeDir(ctx),
  }
}

export type Signals = ReturnType<typeof makeSignals>
