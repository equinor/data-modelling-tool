import React, { useEffect, useState } from 'react'
import useFetch from '../../../components/useFetch'
import { DmtApi } from '../../../api/Api'
import { PageMode } from '../../common/DocumentReducer'
import Api2 from '../../../api/Api2'
const api = new Api2()

export type DocumentData = {
  template: any
  formData: any
  view?: any
  uiSchema: any
}

type Props = {
  documentId: string
  pageMode: PageMode
  render: any
}

export default ({ documentId, pageMode, render }: Props) => {
  const [documentData, setDocumentData] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.fetchDocument({
      documentId,
      onSuccess: (data: DocumentData) => {
        setDocumentData(data)
        setLoading(false)
      },
      onError: () => setLoading(false),
    })
  }, [documentId, pageMode])

  if (loading) {
    return <div>Loading...</div>
  }
  if (documentData && Object.keys(documentData).length > 0) {
    return render(documentData)
  }
  return null
}
