import * as vscode from 'vscode';
import * as sh from 'shelljs';
import { getActiveMicromambaEnvironmentPrefixName } from './activateMicromambaEnvironment';
import { ExtensionContext } from './makeExtensionContext';
import { findMicromambaEnvironmentQuickPickItems } from './pickMicromambaEnvironmentPrefixName';

const setContext = <T>(key: string, value: T): void => {
  vscode.commands.executeCommand('setContext', key, value);
};

const _refreshContextFlags = (options: {
  hasCreatedEnvs: boolean;
  hasActivatedEnv: boolean;
  hasMicromambaDir: boolean;
}): void => {
  const { hasCreatedEnvs, hasActivatedEnv, hasMicromambaDir } = options;
  setContext('corker.micromamba.can.activate.environment', hasCreatedEnvs);
  setContext('corker.micromamba.can.deactivate.environment', hasActivatedEnv);
  setContext('corker.micromamba.can.remove.environment', hasActivatedEnv);
  setContext('corker.micromamba.can.clear.all', hasMicromambaDir);
};

export const refreshContextFlags = async (
  context: vscode.ExtensionContext,
  extContext?: ExtensionContext
): Promise<void> => {
  if (extContext) {
    const items = await findMicromambaEnvironmentQuickPickItems(extContext);
    const name = getActiveMicromambaEnvironmentPrefixName(context);
    const item = items.find((x) => x.data.content.name === name);
    const hasCreatedEnvs = items.length > 0;
    const hasActivatedEnv = !!item;
    const hasMicromambaDir = sh.test('-d', extContext.micromambaDir);
    _refreshContextFlags({ hasCreatedEnvs, hasActivatedEnv, hasMicromambaDir });
  } else {
    const hasCreatedEnvs = false;
    const hasActivatedEnv = false;
    const hasMicromambaDir = false;
    _refreshContextFlags({ hasCreatedEnvs, hasActivatedEnv, hasMicromambaDir });
  }
};
