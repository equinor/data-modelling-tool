import { useContext, useEffect, useState } from 'react'
import { DmssAPI } from '../services/api/DmssAPI'
import { AuthContext } from 'react-oauth2-code-pkce'

export const useDocument = (dataSourceId: string, documentId: string) => {
  const [document, setDocument] = useState<Object | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const target = documentId.split('.')
  const id = `${target.shift()}`
  const attribute = target.join('.')

  useEffect(() => {
    setLoading(true)
    dmssAPI
      .getDocumentById({ dataSourceId, documentId: id, attribute })
      .then((document) => {
        setDocument(document.document)
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
        attribute,
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
