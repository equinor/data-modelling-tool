import { useEffect, useState, useContext } from 'react'
import { DmssAPI, AuthContext } from '@dmt/common'

export function useSearch<T>(
  body: any,
  dataSourceId: string,
  sortByAttribute?: string
): [T[], boolean, boolean] {
  const [searchResult, setSearchResult] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  // @ts-ignore
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setIsLoading(true)
    dmssAPI
      .search({
        dataSources: [dataSourceId],
        body: body,
        sortByAttribute: sortByAttribute,
      })
      .then((response: any) => {
        const data = response.data
        // @ts-ignore
        setSearchResult(Object.values(data))
      })
      .catch((err: any) => {
        console.error(err)
        setHasError(true)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return [searchResult, isLoading, hasError]
}
