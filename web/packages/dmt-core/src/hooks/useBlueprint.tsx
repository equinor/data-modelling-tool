import { useContext, useEffect, useState } from 'react'
import { DmssAPI } from '../services/api/DmssAPI'
import { AuthContext } from 'react-oauth2-code-pkce'

/**
 * Hook to fetch a Blueprint from the DMSS API
 *
 * @docs Hooks
 *
 * @usage
 * Code example:
 * ```
 * import { useBlueprint } from '@data-modelling-tool/core'
 *
 * const [blueprint, isLoading, error] = useBlueprint('someType')
 * if (isLoading) return <div>Loading...</div>
 * if (error) return <div>Error getting the blueprint</div>
 *
 * if (blueprint) {
 *   return (<p>Blueprint: {blueprint?.name} ({blueprint?.type})</p>)
 * }
 * ```
 *
 * @param typeRef - The reference to the blueprint to retrieve
 * @returns A list containing the blueprint document, a boolean representing the loading state, and an Error, if any.
 */
export const useBlueprint = (typeRef: string) => {
  const [blueprint, setBlueprint] = useState<any | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setLoading(true)
    dmssAPI
      .blueprintGet({ typeRef: typeRef })
      .then((response: any) => {
        const data = response.data
        setBlueprint(data)
        setError(null)
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false))
  }, [typeRef])

  return [blueprint, isLoading, error]
}
