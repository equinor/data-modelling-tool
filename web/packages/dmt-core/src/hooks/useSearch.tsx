import { useEffect, useState, useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { DmssAPI } from '../services'

export function useSearch<T>(
  body: any,
  dataSourceId: string,
  sortByAttribute?: string
): [T[], boolean, boolean] {
  const [searchResult, setSearchResult] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
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
