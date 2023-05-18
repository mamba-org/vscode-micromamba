import { join } from 'path';
import sh from '../sh';
import { MicromambaParams } from './makeMicromambaParams';


export async function ensureMicromambaDir(info: MicromambaParams) {
  try {
    await sh.mkdirp(info.mambaRootPrefix);
  } catch (ignore) {
    throw new Error(`Can't create directory: ${info.mambaRootPrefix}`);
  }
  try {
    await sh.mkdirp(info.workspaceMicromambaDir);
    const gitIgnorePath = join(info.workspaceMicromambaDir, '.gitignore');
    if (!(await sh.testf(gitIgnorePath)))
      await sh.writeFile(gitIgnorePath, '*');
  } catch (ignore) {
    throw new Error(`Can't create directory: ${info.workspaceMicromambaDir}`);
  }
  try {
    await sh.mkdirp(info.envsDir);
  } catch (ignore) {
    throw new Error(`Can't create directory: ${info.envsDir}`);
  }
}
