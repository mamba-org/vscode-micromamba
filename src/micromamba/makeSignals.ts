import { Subject, distinctUntilChanged, shareReplay, startWith } from "rxjs";
import { ExtensionContext } from "vscode";

export const GLOBAL_HOME_DIR_KEY = 'micromamba.global.home.dir'
export const ACTIVE_ENVIRONMENT_NAME_KEY = 'micromamba.active.environment.name'
export const ACTIVE_ENVIRONMENT_PATH_KEY = 'micromamba.active.environment.path'

export function readGlobalHomeDir(ctx: ExtensionContext) {
  return ctx.globalState.get<string>(GLOBAL_HOME_DIR_KEY);
}

export interface EnvironmentNameParams {
  name: string
  path: undefined
}

export interface EnvironmentPathParams {
  name: undefined
  path: string
}

export type EnvironmentParams = EnvironmentPathParams | EnvironmentNameParams | undefined

export function readActiveEnvironmentParams(ctx: ExtensionContext) {
  const name = ctx.workspaceState.get<string>(ACTIVE_ENVIRONMENT_NAME_KEY)
  const path = ctx.workspaceState.get<string>(ACTIVE_ENVIRONMENT_PATH_KEY)  
  return (name ?? path) === undefined ? undefined : {
    name: ctx.workspaceState.get<string>(ACTIVE_ENVIRONMENT_NAME_KEY),
    path: ctx.workspaceState.get<string>(ACTIVE_ENVIRONMENT_PATH_KEY),
  } as EnvironmentParams
}

export function makeGlobalHomeDir(ctx: ExtensionContext) {
  const value = readGlobalHomeDir(ctx)
  const subject = new Subject<string | undefined>()
  const values$ = subject.pipe(startWith(value), distinctUntilChanged(), shareReplay(1))
  return {
    set(value: string | undefined) {
      void ctx.globalState.update(GLOBAL_HOME_DIR_KEY, value).then()
      subject.next(value)
    },
    values$
  }
}

export type GlobalHomeDir = ReturnType<typeof makeGlobalHomeDir>

export function makeActiveEnvironmentParams(ctx: ExtensionContext) {
  const value = readActiveEnvironmentParams(ctx)
  const subject = new Subject<EnvironmentParams>()
  const values$ = subject.pipe(startWith(value), distinctUntilChanged(), shareReplay(1))
  return {
    set(value: EnvironmentParams) {
      void ctx.workspaceState.update(ACTIVE_ENVIRONMENT_NAME_KEY, value?.name).then()
      void ctx.workspaceState.update(ACTIVE_ENVIRONMENT_PATH_KEY, value?.path).then()
      subject.next(value)
    },
    values$
  }
}

export type ActiveEnvironmentParams = ReturnType<typeof makeActiveEnvironmentParams>

export function makeSignals(ctx: ExtensionContext) {
  return {
    activeEnvironmentInput: makeActiveEnvironmentParams(ctx),
    globalHomeDir: makeGlobalHomeDir(ctx),
  }
}

export type Signals = ReturnType<typeof makeSignals>
