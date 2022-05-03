import * as React from 'react'

import './index.css'
import { DmtPluginType, DmtUIPlugin, useDocument } from '@dmt/common'
import PreviewPlugin from './YamlPlugin'

const PluginComponent = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  const [document, loading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId,
    true
  )
  if (loading) return <div>Loading...</div>
  return <PreviewPlugin document={document} />
}

export const plugins: any = [
  {
    pluginName: 'yaml-view',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]