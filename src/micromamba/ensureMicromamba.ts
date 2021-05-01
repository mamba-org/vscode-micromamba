import * as sh from 'shelljs';
import { downloadMicromamba } from './downloadMicromamba';

export const isMicromambaInstalled = (): boolean => {
  return !!sh.which('micromamba');
};

export const ensureMicromamba = async (cwd: string): Promise<void> => {
  if (isMicromambaInstalled()) return;
  await downloadMicromamba(cwd);
};
