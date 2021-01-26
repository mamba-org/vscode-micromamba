import { isWindows } from './infra';
import {
  parseMicromambaShellActivateResponse,
  getMicromambaEnvVariables,
  getMicromambaEnvVariablesNonWin,
  getMicromambaEnvVariablesWin,
} from './getMicromambaEnvVariables';

it('parseMicromambaShellActivateResponseNonWin', () => {
  const res = `
SPACE_ENDING=space ending 
SPACE_STARTING= space starting
VAR=var
'`;
  const vars = parseMicromambaShellActivateResponse(res);
  expect(vars).toEqual([
    { name: 'SPACE_ENDING', value: 'space ending ' },
    { name: 'SPACE_STARTING', value: ' space starting' },
    { name: 'VAR', value: 'var' },
  ]);
});
it('getMicromambaEnvVariables', () => {
  const expected = isWindows ? getMicromambaEnvVariablesWin : getMicromambaEnvVariablesNonWin;
  expect(getMicromambaEnvVariables).toBe(expected);
});
