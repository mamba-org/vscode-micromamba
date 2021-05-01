import { Observable } from 'rxjs';
import { EnvironmentPrefix } from './environments';

export type ExtensionContext = {
  rootDir: string;
  micromambaDir: string;
  micromambaPath: string;
};

export type ActiveEnvironmentPrefix = EnvironmentPrefix | undefined;

export interface DisposableLike {
  dispose: () => void;
}

export interface ActiveEnvironmentManager {
  readonly prefix$: Observable<ActiveEnvironmentPrefix>;
  activate(prefix: EnvironmentPrefix): void;
  deactivate(): void;
}
