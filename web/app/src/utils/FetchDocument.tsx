import React, { useEffect, useState } from 'react'
import useExplorer, { IUseExplorer } from '../hooks/useExplorer'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
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
      try {
        const result = await explorer.get(getProps)
        // @ts-ignore
        setDocument(result)
      } catch (e) {
        console.error(e)
        NotificationManager.error(e.message, 'Error', 0)
      }

      setLoading(false)
    }
    load()
  }, [dataSourceId, documentId, render])

  if (loading) {
    return <div>Loading...</div>
  }

  return render(document)
}
