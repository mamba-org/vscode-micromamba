import { Disposable } from 'vscode'

export type DisposableLike = Parameters<typeof Disposable.from>[0]
