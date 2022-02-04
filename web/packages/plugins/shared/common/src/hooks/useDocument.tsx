import { useContext, useEffect, useState } from 'react'
import { DmssAPI } from '../services/api/DmssAPI'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { AuthContext } from '@dmt/common'

export const useDocument = (dataSourceId: string, documentId: string) => {
  const [document, setDocument] = useState<any>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setLoading(true)
    dmssAPI
      .getDocumentById({ dataSourceId, documentId })
      .then((document) => {
        setDocument(document)
        setError(null)
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false))
  }, [dataSourceId, documentId])

  function updateDocument(newDocument: Object) {
    setLoading(true)
    dmssAPI
      .updateDocumentById({
        dataSourceId,
        documentId,
        data: JSON.stringify(newDocument),
      })
      .then(() => {
        setDocument(newDocument)
        setError(null)
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false))
  }
  return [document, isLoading, updateDocument, error]
}
