import { useContext, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { DmssAPI } from '../services/api/DmssAPI'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { AuthContext } from '../index'

/**
 * A hook for aasly working with documents.
 *
 * @param dataSourceId the data source id
 * @param documentId the document id
 * @param depth the max recursion depth
 * @returns the square root if `x` is non-negative or `NaN` if `x` is negative.
 */
export function useDocument<T>(
  dataSourceId: string,
  documentId: string,
  depth?: number | undefined
): [
  any | null,
  boolean,
  (newDocument: T, notify: boolean) => void,
  AxiosError<any> | null
] {
  const [document, setDocument] = useState<T | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<AxiosError<any> | null>(null)
  // @ts-ignore
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setLoading(true)
    const documentDepth: number = depth || 1
    if (documentDepth < 0 || documentDepth > 999)
      throw new Error('Depth must be a positive number < 999')
    dmssAPI
      .documentGetById({
        dataSourceId: dataSourceId,
        documentId: documentId,
        depth: documentDepth,
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
