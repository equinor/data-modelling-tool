import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/core-plugins'
import { useEffect, useState } from 'react'
import PreviewPlugin from './PreviewPlugin'

const PluginComponent = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId, explorer } = props

  const [document, setDocument] = useState(undefined)

  useEffect(() => {
    if (dataSourceId && documentId) {
      const target = documentId.split('.')
      explorer
        .get({
          dataSourceId,
          documentId: target.shift(),
          attribute: target.join('.'),
        })
        .then((result: any) => {
          setDocument(result.document)
        })
    }
  }, [dataSourceId, documentId])

  if (!document) return <div>Loading...</div>

  return <PreviewPlugin document={document} />
}

export const plugins: any = [
  {
    pluginName: 'default-preview',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]
