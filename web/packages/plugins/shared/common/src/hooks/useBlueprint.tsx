import { useContext, useEffect, useState } from 'react'
import { DmssAPI } from '../services/api/DmssAPI'
import { AuthContext } from '@dmt/common'

export const useBlueprint = (typeRef: string) => {
  const [blueprint, setBlueprint] = useState<any | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setLoading(true)
    dmssAPI
      .getBlueprint({ typeRef: typeRef })
      .then((document) => {
        setBlueprint(document)
        setError(null)
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false))
  }, [typeRef])

  return [blueprint, isLoading, error]
}
