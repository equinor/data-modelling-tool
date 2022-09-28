import { DmssAPI } from '@development-framework/dm-core'

export const search = async (
  dataSourceId: string,
  token: string,
  query: any
) => {
  const dmssAPI = new DmssAPI(token)

  const response = await dmssAPI.search({
    dataSources: [dataSourceId],
    body: query,
    sortByAttribute: 'name',
  })
  return Object.values(response.data)
}
