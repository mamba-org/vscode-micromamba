import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ActiveEnvironmentManager, ActiveEnvironmentPrefix } from '../_definitions';
import { EnvironmentPrefix } from './_definitions';

export function makeActiveEnvironmentManager(): ActiveEnvironmentManager {
  const subject = new Subject<ActiveEnvironmentPrefix>();
  const prefix$: Observable<ActiveEnvironmentPrefix> = subject.pipe(shareReplay(1));
  const activate = (prefix: EnvironmentPrefix): void => subject.next(prefix);
  const deactivate = (): void => subject.next(undefined);
  return { prefix$, activate, deactivate };
}
