export const truncatePathString = (path: string): string => {
  /*
  Truncate path string to have length <= MAX_LENGTH.
   */
  const MAX_LENGTH: number = 55
  if (!path.includes('/') || path.length <= MAX_LENGTH) {
    return path
  }
  const splitTextOnFolders: string[] = path.split('/')
  const finalName: string = splitTextOnFolders[splitTextOnFolders.length - 1]

  let truncatedPath: string = `.../${finalName}`
  let previousPath: string = ''
  let counter: number = 0
  while (truncatedPath.length <= MAX_LENGTH) {
    previousPath = truncatedPath
    truncatedPath = truncatedPath.replace(
      '...',
      `${splitTextOnFolders[counter]}/...`
    )
    if (truncatedPath.length >= MAX_LENGTH) {
      truncatedPath = previousPath
      break
    }
    counter += 1
  }
  return truncatedPath
}
