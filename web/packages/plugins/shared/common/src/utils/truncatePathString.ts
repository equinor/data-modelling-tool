export const truncatePathString = (path: string): string => {
  /*
  Truncate path string to have length <= MAX_LENGTH.
   */
  const MAX_LENGTH: number = 55
  if (!path.includes('/') || path.length <= MAX_LENGTH) {
    return path
  }
  const splitTextOnFolders: string[] = path.split('/')
  const firstFolder: string = splitTextOnFolders[0]
  const secondFolder: string = splitTextOnFolders[1]
  const finalName: string = splitTextOnFolders[splitTextOnFolders.length - 1]
  const truncatedText: string = `${firstFolder}/${secondFolder}/.../${finalName}`
  const truncatedTextSmall: string = `${firstFolder}/.../${finalName}`

  // let temp_path: string = `.../${finalName}`
  // let counter: number = 0
  // while (temp_path.length <= MAX_LENGTH) {
  //   temp_path = temp_path.replace('...', `${splitTextOnFolders[counter]}/...`)
  //   counter += 1
  // }

  if (truncatedText.length <= MAX_LENGTH) {
    return truncatedText
  } else if (
    truncatedText.length > MAX_LENGTH &&
    truncatedTextSmall.length <= MAX_LENGTH
  ) {
    return truncatedTextSmall
  } else if (
    truncatedText.length > MAX_LENGTH &&
    truncatedTextSmall.length > MAX_LENGTH
  ) {
    return `.../${finalName}`
  }
  return path
}
