import React, { useContext, useEffect, useState } from 'react'
import useExplorer, { IUseExplorer } from '../hooks/useExplorer'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { AuthContext } from 'react-oauth2-code-pkce'
import { DmssAPI } from '@dmt/common'

type Props = {
  dataSourceId: string
  documentId: string
  render: any
}

export default ({ dataSourceId, documentId, render }: Props) => {
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const explorer: IUseExplorer = useExplorer(dmssAPI)
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
