import { useEffect, useState, useContext } from 'react'
//@ts-ignore
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
      .search({
        dataSources: [dataSourceId],
        body: body,
      })
      .then((result: any) => {
        // @ts-ignore
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
