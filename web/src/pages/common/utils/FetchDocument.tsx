import React, { useEffect, useState } from 'react'
import Api2 from '../../../api/Api2'

type Props = {
  url: string
  render: any
  updates?: any
}

export default ({ url, render, updates }: Props) => {
  const [document, setDocument] = useState()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    Api2.fetchDocument({
      dataUrl: url,
      onSuccess: (data: any) => {
        setDocument(data)
        setLoading(false)
      },
      onError: (err: any) => setLoading(false),
    })
  }, [url, updates])

  if (loading) {
    return <div>Loading...</div>
  }

  if (document && Object.keys(document).length > 0) {
    return render(document)
  }
  return null
}
