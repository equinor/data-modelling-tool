import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import { DmtPluginType, DmtUIPlugin } from '@dmt/common'
import { useDocument } from '@dmt/common'

const PluginComponent = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, isLoading, setDocument, error] = useDocument(
    dataSourceId,
    documentId,
    true
  )

  if (isLoading) return <div>Loading...</div>

  return <ViewerPDFPlugin document={document} dataSourceId={dataSourceId} />
}

export const plugins: any = [
  {
    pluginName: 'default-pdf',
    pluginType: DmtPluginType.UI,
    component: PluginComponent,
  },
]
