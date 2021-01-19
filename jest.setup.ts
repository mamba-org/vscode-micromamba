import * as sh from 'shelljs';

export default async function (): Promise<void> {
  sh.config.silent = true;
  sh.config.fatal = true;

  sh.config.fatal = true;
  sh.config.silent = false;
  sh.config.verbose = true;
}
