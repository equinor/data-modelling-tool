import { ANALYSIS_PATH, ASSET_PATH, DEFAULT_DATASOURCE_ID } from '../const'
import { DmssAPI } from '@dmt/common'

/**
 * Create a new entity
 *
 * @param directory Path to store the entity in
 * @param body The document (entity) to upload
 * @param token The token to use for authentication
 * @param files The files to upload
 */
const create = (
  directory: string,
  body: any,
  token: string,
  files: Blob[] = [],
  updateUncontained: boolean = false
): Promise<string> => {
  const dmssAPI = new DmssAPI(token)

  return new Promise((resolve, reject) => {
    dmssAPI
      .explorerAddToPath({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        updateUncontained: updateUncontained,
        document: JSON.stringify(body),
        directory: directory,
        files: files.filter((item: any) => item !== undefined),
      })
      .then((response: any) => {
        const data = response.data
        console.log(response)
        resolve(data.uid)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

/**
 * Create a new analysis
 *
 * @param body The analysis entity to upload
 * @param token The token to use for authentication
 * @param files The files to upload
 */
export const createAnalysis = (
  body: any,
  token: string,
  files: Blob[] = []
): Promise<string> => {
  return create(ANALYSIS_PATH, body, token, files)
}

/**
 * Create a new asset
 *
 * @param body The asset entity to upload
 * @param token The token to use for authentication
 * @param files The files to upload
 */
export const createAsset = (
  body: any,
  token: string,
  files: Blob[] = []
): Promise<string> => {
  return create(ASSET_PATH, body, token, files, true)
}
