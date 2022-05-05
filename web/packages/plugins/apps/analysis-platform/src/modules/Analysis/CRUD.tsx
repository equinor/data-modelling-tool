/**
 * Create a new analysis entity
 *
 * @param operationName Name of the operation to create
 * @param user The username of the authenticated user
 */
import { ANALYSIS_PATH, DEFAULT_DATASOURCE_ID } from '../../const'
//@ts-ignore
import { DmssAPI } from '@dmt/common'

export const createAnalysis = (
  body: any,
  token: string,
  files: Blob[] = []
): Promise<string> => {
  const dmssAPI = new DmssAPI(token)

  return new Promise((resolve, reject) => {
    dmssAPI
      .explorerAddToPath({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        document: JSON.stringify(body),
        directory: ANALYSIS_PATH,
        files: files.filter((item: any) => item !== undefined),
      })
      .then((response: any) => {
        const data = response.data
        resolve(data.uid)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}
