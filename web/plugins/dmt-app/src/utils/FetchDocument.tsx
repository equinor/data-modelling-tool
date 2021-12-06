import React, { useContext, useEffect, useState } from 'react'
import useExplorer, { IUseExplorer } from '../hooks/useExplorer'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { DmssAPI, AuthContext, useDocument } from '@dmt/common'
import { ErrorGroup } from '../components/Wrappers'

type Props = {
  dataSourceId: string
  documentId: string
  render: any
}

export default ({ dataSourceId, documentId, render }: Props) => {
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const explorer: IUseExplorer = useExplorer(dmssAPI)
  const [document, documentLoading, setDocument, error] = useDocument(
    dataSourceId,
    documentId
  )
  const [blueprint, setBlueprint] = useState<Object | null>(null)
  const [blueprintError, setBlueprintError] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!document?.type) return
    // @ts-ignore
    explorer
      .getBlueprint(document.type)
      .then((v: any) => setBlueprint(v))
      .catch((error: Error) => setBlueprintError(error))
      .finally(() => setLoading(false))
  }, [documentLoading])

  if (error || blueprintError)
    return (
      <ErrorGroup>
        <b>Error</b>
        <b>
          Failed to fetch document and blueprint
          <code>
            {dataSourceId}/{documentId}
          </code>
        </b>
      </ErrorGroup>
    )

  if (loading) return <div>Loading...</div>

  return render({ document: document, blueprint: blueprint })
}
