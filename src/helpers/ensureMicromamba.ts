import { downloadMicromamba } from './downloadMicromamba';
import { isMicromambaInstalled } from './isMicromambaInstalled';

export const ensureMicromamba = async (cwd: string): Promise<void> => {
  if (isMicromambaInstalled(cwd)) return;
  await downloadMicromamba(cwd);
};
