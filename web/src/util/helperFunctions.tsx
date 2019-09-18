export function getDataSourceIDFromAbsolutID(absolutID: string) {
  return absolutID.split('/', 1)[0]
}
