import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import { DmtPluginType, DmtUIPlugin, Loading } from '@dmt/common'
import { useDocument } from '@dmt/common'

const PluginComponent = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, loading] = useDocument(dataSourceId, documentId, 999)

  if (loading) return <Loading />

  return <ViewerPDFPlugin document={document} dataSourceId={dataSourceId} />
}

export const plugins: any = [
  {
    pluginName: 'default-pdf',
    pluginType: DmtPluginType.UI,
    component: PluginComponent,
  },
]
