import { EnvironmentVariables } from '../micromamba'

export type MicromambaEnvironmentFileContent = {
  readonly name: string
  readonly channels: string[]
  readonly dependencies: string[]
}

export type MicromambaEnvironmentFile = {
  readonly fileName: string
  readonly filePath: string
  readonly content: MicromambaEnvironmentFileContent
}

export type EnvironmentPrefix = string

export interface EnvironmentOK {
  readonly environmentName: EnvironmentPrefix
  readonly vars: EnvironmentVariables
  readonly ok: true
}

export interface EnvironmentFailed {
  readonly environmentName?: EnvironmentPrefix
  readonly ok: false
}

export type EnvironmentInfo = EnvironmentOK | EnvironmentFailed
