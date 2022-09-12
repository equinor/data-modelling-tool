import * as React from 'react'
import { ViewerPDFPlugin } from './PDFViewer'

import {
  EDmtPluginType,
  IDmtUIPlugin,
  Loading,
} from '@data-modelling-tool/core'
import { useDocument } from '@data-modelling-tool/core'

const PluginComponent = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, loading] = useDocument(dataSourceId, documentId, 999)

  if (loading) return <Loading />

  return <ViewerPDFPlugin document={document} dataSourceId={dataSourceId} />
}

export const plugins: any = [
  {
    pluginName: 'default-pdf',
    pluginType: EDmtPluginType.UI,
    component: PluginComponent,
  },
]
