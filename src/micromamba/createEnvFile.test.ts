import { escapeValue } from './createEnvFile'

describe('escapeValue', () => {
  it.each([
    ['\n', '\\n'],
    ['"', '""'],
  ])('%s -> %s', (value, expected) => {
    const actual = escapeValue(value)
    expect(actual).toBe(expected)
  })
})
