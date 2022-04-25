export const truncatePathString = (path: string) => {
  /*
  Truncate path string to have length <= MAX_LENGTH.
   */
  const MAX_LENGTH: number = 60
  const splitTextOnFolder: string[] = path.split('/')
  const DataSource: string = splitTextOnFolder[0]
  const firstFolder: string = splitTextOnFolder[1]
  const finalName: string = splitTextOnFolder[splitTextOnFolder.length - 1]
  const truncatedText: string = `${DataSource}/${firstFolder}/.../${finalName}`
  const truncatedTextSmall: string = `${DataSource}/.../${finalName}`
  if (path.length >= MAX_LENGTH && truncatedText.length <= MAX_LENGTH) {
    return truncatedText
  } else if (path.length >= MAX_LENGTH && truncatedText.length > MAX_LENGTH) {
    return truncatedTextSmall
  } else {
    return path
  }
}
