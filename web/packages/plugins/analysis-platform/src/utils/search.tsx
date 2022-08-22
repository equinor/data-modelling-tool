import { DmssAPI } from '@data-modelling-tool/core'

export const search = async (
  dataSourceId: string,
  token: string,
  query: any
) => {
  const dmssAPI = new DmssAPI(token)

  const response = await dmssAPI.searchDocuments({
    dataSources: [dataSourceId],
    body: query,
    sortByAttribute: 'name',
  })
  return Object.values(response.data)
}
