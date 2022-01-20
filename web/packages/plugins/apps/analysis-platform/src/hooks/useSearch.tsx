import { useEffect, useState, useContext } from 'react'
import { DmssAPI, AuthContext } from '@dmt/common'
import { DEFAULT_DATASOURCE_ID } from '../const'

const useSearch = (
  type: string,
  dataSourceId: string = DEFAULT_DATASOURCE_ID
): any => {
  const [searchResult, setSearchResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setIsLoading(true)
    dmssAPI
      .searchDocuments({
        dataSourceId: dataSourceId,
        body: {
          type: type,
        },
      })
      .then((result: any) => {
        // @ts-ignore-line
        setSearchResult(Object.values(result))
      })
      .catch((err: any) => {
        console.error(err)
        setHasError(true)
      })
      .finally(() => setIsLoading(false))
  }, [dataSourceId, type])

  return [searchResult, isLoading, hasError]
}

export default useSearch
