import { OutputChannel } from "vscode";
import { MicromambaConfig, selfUpdate$ } from "./micromamba";
import { lastValueFrom, tap } from "rxjs";

export function updateMicromamba(info: MicromambaConfig, ch: OutputChannel) {
  return lastValueFrom(selfUpdate$(info).pipe(tap(ch.append)))
}
