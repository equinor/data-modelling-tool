import React, { useEffect, useState } from 'react'
import { PageMode } from '../../common/DocumentReducer'
import Api2 from '../../../api/Api2'
import { DmtApi } from '../../../api/Api'

const api = new DmtApi()

export type DocumentData = {
  template: any
  document: any
}

type Props = {
  dataUrl: string
  schemaUrl: string
  pageMode: PageMode
  render: any
}

export default ({ dataUrl, schemaUrl, pageMode, render }: Props) => {
  const [documentData, setDocumentData] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Api2.fetchWithTemplate({
      urlData: dataUrl,
      urlSchema: schemaUrl,
      onSuccess: (data: DocumentData) => {
        setDocumentData(data)
        setLoading(false)
      },
      onError: (err: any) => setLoading(false),
    })
  }, [dataUrl, schemaUrl, pageMode])

  if (loading) {
    return <div>Loading...</div>
  }
  if (documentData && Object.keys(documentData).length > 0) {
    return render(documentData)
  }
  return null
}
