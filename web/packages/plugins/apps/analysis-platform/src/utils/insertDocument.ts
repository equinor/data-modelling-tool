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
    dmssAPI.generatedDmssApi
      .explorerAddToPath({
        dataSourceId: dataSourceId,
        document: JSON.stringify(body),
        directory: directory,
        files: files.filter((item: any) => item !== undefined),
      })
      .then((response: string) => {
        const data = JSON.parse(response)
        resolve(data.uid)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}
