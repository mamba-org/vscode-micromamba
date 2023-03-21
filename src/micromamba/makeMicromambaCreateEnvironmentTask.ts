import { spawn } from 'child_process'
import { Observable, Subscription } from 'rxjs'
import * as vscode from 'vscode'
import { isWindows } from '../helpers/infra'
import { ExtensionContext } from '../_definitions'

export const getMicromambaCreateEnvironmentArgs = (environmentFileName: string): string[] => [
  'create',
  '--file',
  environmentFileName,
  '--yes',
]

export const makeMicromambaCreateEnvironmentTask = (
  extContext: ExtensionContext,
  environmentFileName: string,
  workspaceFolder: vscode.WorkspaceFolder
): vscode.Task => {
  const newLocal = new vscode.CustomExecution(async () => {
    const writeEmitter = new vscode.EventEmitter<string>();
    const closeEmitter = new vscode.EventEmitter<number>();
    const process$ = new Observable<string>((o) => {
      const child = spawn(extContext.micromambaPath, [
        'create',
        '--file',
        environmentFileName,
        '--yes',
      ], {
        cwd: workspaceFolder.uri.path,
        env: process.env,
      })
      child.stderr.setEncoding('utf8')
      child.stderr.on('data', (chunk) => {
        const data = isWindows ? chunk.toString() : chunk.toString().replaceAll('\n', '\r\n')
        o.next(data)
      })
      child.stdout.setEncoding('utf8')
      child.stdout.on('data', (chunk) => {
        const data = isWindows ? chunk.toString() : chunk.toString().replaceAll('\n', '\r\n')
        o.next(data)
      })
      child.on('error', (err) => writeEmitter.fire(`${err.name}: ${err.message}`))
      child.on('close', (code) => {
        if (code === 0) o.complete()
        else o.error(code)
      })
      return () => child.kill()
    })
    let sub: Subscription
    const pty: vscode.Pseudoterminal = {
      onDidWrite: writeEmitter.event,
      onDidClose: closeEmitter.event,
      open: () => {
        sub = process$.subscribe({
          next: (o) => writeEmitter.fire(o),
          error: (err) => closeEmitter.fire(err ?? -1),
          complete: () => closeEmitter.fire(0),
        })
      },
      close: () => sub.unsubscribe(),
    };
    return pty
  })
    return new vscode.Task(
      { type: 'micromamba' },
      workspaceFolder,
      'create environment',
      'micromamba',
      newLocal
    )
  }
