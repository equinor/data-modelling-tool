import { useContext, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { DmssAPI } from '../services/api/DmssAPI'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { AuthContext } from '@dmt/common'

export function useDocument<T>(
  dataSourceId: string,
  documentId: string,
  depth?: number | undefined
): [T | null, boolean, Function, AxiosError<any> | null] {
  const [document, setDocument] = useState<T | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<AxiosError<any> | null>(null)
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setLoading(true)
    let defaultDepth = 1
    if (depth === undefined) depth = defaultDepth
    if (depth < 0 || depth > 999)
      throw new Error('Depth must be a positive number < 999')
    dmssAPI
      .documentGetById({
        dataSourceId: dataSourceId,
        documentId: documentId,
        depth: depth,
      })
      .then((response: any) => {
        const data = response.data
        setDocument(data)
        setError(null)
      })
      .catch((error: AxiosError) => setError(error))
      .finally(() => setLoading(false))
  }, [dataSourceId, documentId])

  function updateDocument(newDocument: T, notify: boolean): void {
    setLoading(true)
    dmssAPI
      .documentUpdate({
        dataSourceId: dataSourceId,
        documentId: documentId,
        data: JSON.stringify(newDocument),
        updateUncontained: false,
      })
      .then(() => {
        setDocument(newDocument)
        setError(null)
        if (notify) NotificationManager.success('Document updated')
      })
      .catch((error: AxiosError<any>) => {
        console.error(error)
        if (notify)
          NotificationManager.error(
            JSON.stringify(error?.response?.data?.message),
            'Failed to update document',
            0
          )
        setError(error)
      })
      .finally(() => setLoading(false))
  }

  return [document, isLoading, updateDocument, error]
}
