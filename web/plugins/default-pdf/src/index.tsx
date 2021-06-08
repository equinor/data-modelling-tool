import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import { DmtPluginType, DmtUIPlugin } from '@dmt/core-plugins'
import { useEffect, useState } from 'react'

const PluginComponent = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId, explorer } = props

  const [document, setDocument] = useState(undefined)

  useEffect(() => {
    if (!document && dataSourceId && documentId) {
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

  return <ViewerPDFPlugin document={document} />
}

export const plugins: any = [
  {
    pluginName: 'default-pdf',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]
