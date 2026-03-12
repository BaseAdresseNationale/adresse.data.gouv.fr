import path from 'path'

export function getRootPath() {
  const currentWorkingDirectory = process.cwd()
  const standaloneSuffix = `${path.sep}.next${path.sep}standalone`

  if (currentWorkingDirectory.endsWith(standaloneSuffix)) {
    return currentWorkingDirectory.slice(0, -standaloneSuffix.length)
  }

  return currentWorkingDirectory
}
