import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/core-plugins'
import { useEffect, useState } from 'react'
import PreviewPlugin from './PreviewPlugin'

export const pluginName = 'default-preview'
export const pluginType = DmtPluginType.UI

export const PluginComponent = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId, explorer } = props

  const [document, setDocument] = useState(undefined)

  useEffect(() => {
    if (dataSourceId && documentId) {
      const target = documentId.split('.')
      explorer.get({ dataSourceId, documentId: target.shift(), attribute: target.join('.') }).then((result: any) => {
        setDocument(result.document)
      })
    }
  }, [dataSourceId, documentId])

  if (!document) return <div>Loading...</div>

  return (
    <PreviewPlugin document={document} />
  )
}