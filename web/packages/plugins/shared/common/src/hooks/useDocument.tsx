import { useContext, useEffect, useState } from 'react'
import { DmssAPI } from '../services/api/DmssAPI'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { AuthContext } from '@dmt/common'

export const useDocument = (
  dataSourceId: string,
  documentId: string,
  resolved: boolean | undefined
) => {
  const [document, setDocument] = useState<any>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setLoading(true)
    let depth = 1
    if (resolved) depth = 999
    dmssAPI
      .getDocumentById({ dataSourceId, documentId, depth })
      .then((document) => {
        setDocument(document)
        setError(null)
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false))
  }, [dataSourceId, documentId])

  function updateDocument(newDocument: Object, notify: boolean) {
    setLoading(true)
    dmssAPI
      .updateDocumentById({
        dataSourceId,
        documentId,
        data: JSON.stringify(newDocument),
        updateUncontained: true,
      })
      .then(() => {
        setDocument(newDocument)
        setError(null)
        if (notify) NotificationManager.success('Document updated')
      })
      .catch((error: Error) => {
        console.error(error)
        if (notify)
          NotificationManager.error(
            JSON.stringify(error.message),
            'Failed to update document'
          )
        setError(error)
      })
      .finally(() => setLoading(false))
  }

  return [document, isLoading, updateDocument, error]
}
