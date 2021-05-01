import * as fs from 'fs';
import { join } from 'path';
import { EnvironmentVariables } from '../micromamba';
import { ExtensionContext } from '../_definitions';

export const escapeValue = (value: string): string =>
  value.replace(/\n/g, '\\n').replace(/"/g, '""');

export const createEnvFile = (
  vars: EnvironmentVariables,
  extContext: ExtensionContext,
  prefixName: string
): void => {
  const envFilePath = join(extContext.micromambaDir, `.env.${prefixName}`);
  const data = [...vars.map((x) => `${x.name}="${x.value}"`)].join('\n');
  fs.writeFileSync(envFilePath, data, { encoding: 'utf8' });
};
