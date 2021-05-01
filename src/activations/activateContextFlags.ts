import * as vscode from 'vscode';
import * as sh from 'shelljs';
import { DisposableLike, ExtensionContext } from '../_definitions';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { EnvironmentInfo, findMicromambaEnvironmentQuickPickItems } from '../environments';

const setContext = <T>(key: string, value: T): void => {
  vscode.commands.executeCommand('setContext', key, value);
};

export const activateContextFlags = (
  extContext: ExtensionContext,
  info$: Observable<EnvironmentInfo>
): DisposableLike => {
  const sub = info$
    .pipe(
      concatMap(async (info) => ({
        info,
        items: await findMicromambaEnvironmentQuickPickItems(extContext),
      }))
    )
    .subscribe(({ info, items }) => {
      const name = info.environmentName;
      const item = items.find((x) => x.data.content.name === name);
      const hasCreatedEnvs = items.length > 0;
      const hasActivatedEnv = !!item;
      const hasMicromambaDir = sh.test('-d', extContext.micromambaDir);
      setContext('corker.micromamba.can.activate.environment', hasCreatedEnvs);
      setContext('corker.micromamba.can.deactivate.environment', hasActivatedEnv);
      setContext('corker.micromamba.can.remove.environment', hasActivatedEnv);
      setContext('corker.micromamba.can.clear.all', hasMicromambaDir);
    });
  return { dispose: () => sub.unsubscribe() };
};
