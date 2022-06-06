import { useContext, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { DmssAPI } from '../services/api/DmssAPI'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { AuthContext } from '@dmt/common'

export function useDocument<T>(
  dataSourceId: string,
  documentId: string,
  resolved?: boolean | undefined
): [T | null, boolean, Function, AxiosError<any> | null, Function] {
  const [document, setDocument] = useState<T | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<AxiosError<any> | null>(null)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    fetchDocument()
  }, [dataSourceId, documentId])

  function fetchDocument(): void {
    setLoading(true)
    let depth = 1
    if (resolved) depth = 999
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
  }

  function updateDocument(
    newDocument: T,
    notify: boolean,
    functionToRunAfterUpdate?: Function
  ): void {
    /*
      Will update the document in the database.
      functionToRunAfterUpdate is an optional function that will run
       after the database update is complete.
     */
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
        if (functionToRunAfterUpdate) {
          functionToRunAfterUpdate()
        }
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

  return [document, isLoading, updateDocument, error, fetchDocument]
}
