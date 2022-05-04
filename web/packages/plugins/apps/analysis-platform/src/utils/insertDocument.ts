//@ts-ignore
import { DmssAPI } from '@dmt/common'
import { DEFAULT_DATASOURCE_ID, ENTITIES } from '../const'

export const addToPath = (
  body: any,
  token: string,
  files: Blob[] = [],
  dataSourceId: string = DEFAULT_DATASOURCE_ID,
  directory: string = ENTITIES
): Promise<string> => {
  const dmssAPI = new DmssAPI(token)

  return new Promise((resolve, reject) => {
    dmssAPI
      .explorerAddToPath({
        dataSourceId: dataSourceId,
        document: JSON.stringify(body),
        directory: directory,
        files: files.filter((item: any) => item !== undefined),
      })
      .then((response: any) => {
        resolve(response.uid)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}
