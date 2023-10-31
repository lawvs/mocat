import { execSync } from 'child_process'

const hasGit = () => {
  try {
    execSync('git --version')
  } catch {
    return false
  }
  return true
}

const getTopLevel = () => execSync('git rev-parse --show-toplevel')

const isRepository = () => {
  try {
    getTopLevel()
  } catch {
    return false
  }
  return true
}

export const getGitVersion = () => {
  if (!hasGit() || !isRepository()) {
    console.error(
      "You haven't installed git or it does not exist in your PATH.",
    )
    return null
  }
  const version = execSync('git describe --always --dirty')
    .toString()
    // remove empty line
    .replace(/[\s\r\n]+$/, '')

  return version
}
