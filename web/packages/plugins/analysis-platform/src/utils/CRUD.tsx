import { ANALYSIS_PATH, ASSET_PATH, DEFAULT_DATASOURCE_ID } from '../const'
import { DmssAPI } from '@dmt/common'
import { AxiosResponse } from 'axios'

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
      .then((response: AxiosResponse<any>) => {
        const data = response.data
        resolve(data.uid)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const update = (
  documentId: string,
  body: any,
  attribute: string,
  token: string,
  files: Blob[] = [],
  updateUncontained: boolean = false
): Promise<string> => {
  const dmssAPI = new DmssAPI(token)

  return new Promise((resolve, reject) => {
    dmssAPI
      .documentUpdate({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        documentId: documentId,
        updateUncontained: updateUncontained,
        data: JSON.stringify(body),
        attribute: attribute,
        files: files,
      })
      .then((response: AxiosResponse<any>) => {
        const data = response.data
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

const insertReference = (
  documentDottedId: string,
  body: any,
  token: string
): Promise<any> => {
  const dmssAPI = new DmssAPI(token)

  return new Promise((resolve, reject) => {
    dmssAPI
      .referenceInsert({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        documentDottedId: documentDottedId,
        reference: body,
      })
      .then((response: AxiosResponse<any>) => {
        const data = response.data
        resolve(data)
      })
      .catch((err: any) => {
        reject(err)
      })
  })
}

export const addAnalysisToAsset = (
  documentDottedId: string,
  body: any,
  token: string
): Promise<string> => {
  return insertReference(documentDottedId, body, token)
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
  return create(ANALYSIS_PATH, body, token, files, false)
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
