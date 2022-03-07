import { useEffect, useState, useContext } from 'react'
import { DmssAPI, AuthContext } from '@dmt/common'

export const useSearch = (body: any, dataSourceId: string): any => {
  const [searchResult, setSearchResult] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  // @ts-ignore
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setIsLoading(true)
    dmssAPI
      .searchDocuments({
        dataSources: [dataSourceId],
        body: body,
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
  }, [])

  return [searchResult, isLoading, hasError]
}
