import { pickMicromambaEnvironmentPrefixName } from '../environments';
import { CommandLike } from './_definitions';

export const runActivateEnvironmentCommand: CommandLike = async ({ extContext, manager }) => {
  const prefixName = await pickMicromambaEnvironmentPrefixName(
    extContext,
    'Select environment to activate'
  );
  if (!prefixName) return;
  manager.activate(prefixName);
};
