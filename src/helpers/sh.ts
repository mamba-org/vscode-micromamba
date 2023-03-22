import 'graceful-fs'
import fsx from 'fs-extra'
import klaw from 'klaw-sync'
import path from 'path'

async function testf(path: string) {
  if (await fsx.pathExists(path)) {
    const stat = await fsx.stat(path)
    return stat.isFile()
  }
  return false
}

async function testd(path: string) {
  if (await fsx.pathExists(path)) {
    const stat = await fsx.stat(path)
    return stat.isDirectory()
  }
  return false
}

function mkdirp(path: string) {
  return fsx.mkdirp(path)
}

function mv(src: string, dest: string) {
  return fsx.rename(src, path.join(dest, path.basename(src)))
}

function ls(path: string) {
  return fsx.readdir(path)
}

function rmrf(path: string) {
  return fsx.rm(path, { force: true, recursive: true, maxRetries: 3 })
}

function chmodR(mode: string, path: string) {
  return Promise.all(klaw(path).map((x) => fsx.chmod(x.path, mode)))
}

function chmod(mode: string, path: string) {
  return fsx.chmod(path, mode)
}

function writeFile(path: string, data: string) {
  return fsx.writeFile(path, data)
}

const sh = {
  testd,
  testf,
  mkdirp,
  mv,
  ls,
  rmrf,
  chmodR,
  chmod,
  writeFile,
}

export default sh
