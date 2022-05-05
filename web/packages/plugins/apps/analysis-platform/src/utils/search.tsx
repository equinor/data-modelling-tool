import { DmssAPI } from '@dmt/common'

export const search = async (
  dataSourceId: string,
  token: string,
  query: any
) => {
  const dmssAPI = new DmssAPI(token)

  let response = await dmssAPI.searchDocuments({
    dataSources: [dataSourceId],
    body: query,
    sortByAttribute: 'name',
  })
  return Object.values(response.data)
}
