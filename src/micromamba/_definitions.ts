export interface EnvironmentVariable {
  readonly name: string
  readonly value: string
}

export type EnvironmentVariables = Array<EnvironmentVariable>
