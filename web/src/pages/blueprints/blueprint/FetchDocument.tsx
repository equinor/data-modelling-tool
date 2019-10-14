import React, { useEffect, useState } from 'react'
import { PageMode } from '../../common/DocumentReducer'
import Api2 from '../../../api/Api2'
import { DmtApi } from '../../../api/Api'
import { DocumentData } from './types'

const api = new DmtApi()

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
