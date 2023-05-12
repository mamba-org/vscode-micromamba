import { OutputChannel } from 'vscode'
import { Signals } from './makeSignals'
import { MicromambaInfo } from './makeMicromambaInfo'

export interface EnvironmentVariable {
  readonly name: string
  readonly value: string
}

export type EnvironmentVariables = Array<EnvironmentVariable>

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

export type EnvironmentName = string

export interface EnvironmentOK {
  readonly ch: OutputChannel
  readonly signals: Signals
  readonly info: MicromambaInfo
  readonly environmentName: EnvironmentName
  readonly vars: EnvironmentVariables
  readonly ok: true
}

export interface EnvironmentFailed {
  readonly ch: OutputChannel
  readonly signals: Signals
  readonly info: MicromambaInfo
  readonly environmentName?: EnvironmentName
  readonly ok: false
}

export type EnvironmentInfo = EnvironmentOK | EnvironmentFailed
