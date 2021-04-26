import * as fs from 'fs';
import { join } from 'path';
import { ExtensionContext } from './makeExtensionContext';

export const escapeValue = (value: string): string =>
  value.replace(/\n/g, '\\n').replace(/"/g, '""');

export const createEnvFile = (
  env: { name: string; value: string }[],
  extContext: ExtensionContext,
  prefixName: string
): void => {
  const envFilePath = join(extContext.micromambaDir, `.env.${prefixName}`);
  const data = [...env.map((x) => `${x.name}="${x.value}"`)].join('\n');
  fs.writeFileSync(envFilePath, data, { encoding: 'utf8' });
};
