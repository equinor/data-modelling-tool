export function getDataSourceIDFromAbsolutID(absolutID: string) {
  return absolutID.split('/', 1)[0]
}

/**
 * Usage:
 *
 * const [dataSourceId, nodeId] = splitDataSourceAndNodeId
 * @param id
 */
export function splitDatasourceAndNodeId(id: string) {
  return id.split('/')
}
