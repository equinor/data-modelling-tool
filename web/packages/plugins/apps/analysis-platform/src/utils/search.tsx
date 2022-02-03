import {DmssAPI} from "@dmt/common/services/api/DmssAPI";

export const search = async (dataSourceId: string, token: string, query: any) => {
    const dmssAPI = new DmssAPI(token)

    let result = await dmssAPI.searchDocuments({
        dataSourceId: dataSourceId,
        body: query,
        sortByAttribute: 'name',
    })
    return Object.values(result)
}