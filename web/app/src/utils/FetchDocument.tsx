import React, { useEffect, useState } from 'react'
import useExplorer, { IUseExplorer } from '../hooks/useExplorer'

type Props = {
  dataSourceId: string
  documentId: string
  render: any
}

export default ({ dataSourceId, documentId, render }: Props) => {
  const explorer: IUseExplorer = useExplorer({})
  const [document, setDocument] = useState()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const load = async () => {
      const target = documentId.split('.')
      const getProps = {
        dataSourceId,
        // @ts-ignore
        documentId: target.shift().toString(),
        attribute: target.join('.'),
      }
      const result = await explorer.get(getProps)
      // @ts-ignore
      setDocument(result)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceId, documentId])

  if (loading) {
    return <div>Loading...</div>
  }

  return render(document)
}
