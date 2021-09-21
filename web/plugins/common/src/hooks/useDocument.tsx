import { useContext, useEffect, useState } from 'react'
import { DmssAPI } from '../services/api/DmssAPI'
import { AuthContext } from '../../../../app/src/context/auth/AuthContext'

export const useDocument = (dataSourceId: string, documentId: string) => {
  const [document, setDocument] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  useEffect(() => {
    setLoading(true)
    const target = documentId.split('.')
    const id = `${target.shift()}`
    const attribute = target.join('.')
    dmssAPI
      .getDocumentById({ dataSourceId, documentId: id, attribute })
      .then((document) => {
        console.log(document)
        setDocument(document.document)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setHasError(true)
      })
  }, [dataSourceId, documentId])
  return [document, isLoading, setDocument, hasError]
}
