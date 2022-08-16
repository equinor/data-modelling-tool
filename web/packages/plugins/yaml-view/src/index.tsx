import * as React from 'react'

import './index.css'
import { DmtPluginType, DmtUIPlugin, Loading, useDocument } from '@dmt/common'
import PreviewPlugin from './YamlPlugin'

const PluginComponent = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  // eslint-disable-next-line
  const [document, loading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId,
    999
  )
  if (loading) return <Loading />
  if (error) {
    const errorResponse =
      typeof error.response?.data == 'object'
        ? error.response?.data?.message
        : error.response?.data
    return <pre style={{ color: 'red' }}>{errorResponse}</pre>
  }
  return <PreviewPlugin document={document} />
}

export const plugins: any = [
  {
    pluginName: 'yaml-view',
    pluginType: DmtPluginType.UI,
    component: PluginComponent,
  },
]
