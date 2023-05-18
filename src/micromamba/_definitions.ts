import { OutputChannel } from 'vscode'
import { EnvironmentParams, Signals } from './makeSignals'
import { MicromambaParams } from './makeMicromambaParams'

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

export interface EnvironmentOK {
  readonly ch: OutputChannel
  readonly signals: Signals
  readonly params: {
    readonly micromambaParams: MicromambaParams
    readonly environmentParams: EnvironmentParams
  }
  readonly vars: EnvironmentVariables
  readonly ok: true
}

export interface EnvironmentFailed {
  readonly ch: OutputChannel
  readonly signals: Signals
  readonly params: {
    readonly micromambaParams: MicromambaParams
    readonly environmentParams: EnvironmentParams
  }
  readonly ok: false
}

export type EnvironmentInfo = EnvironmentOK | EnvironmentFailed
