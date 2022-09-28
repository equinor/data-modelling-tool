import { useContext, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { DmssAPI } from '../services/api/DmssAPI'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { AuthContext } from 'react-oauth2-code-pkce'

/**
 * A hook for asynchronously working with documents.
 *
 * @docs Hooks
 *
 * @usage
 * Code example:
 * ```
 * import { useDocument } from '@data-modelling-tool/core'
 *
 * const [
 *   document,
 *   loading,
 *   updateDocument,
 *   error,
 * ] = useDocument(dataSourceId, documentId)
 *
 * if (loading) return <div>Loading...</div>
 *
 * if (error) {
 *   console.error(error)
 *   return <div>Error getting the document</div>
 * }
 *
 * <DisplayDocument document={document} />
 * ```
 *
 * @param dataSourceId The ID of the data source
 * @param documentId The ID of the document
 * @param depth The maximum depth level of nested objects to resolve
 * @returns A list containing the document, a boolean representing the loading state, a function to update the document, and an Error, if any.
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
