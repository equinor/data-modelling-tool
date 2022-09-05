import React from 'react'

import { DmtPluginType, IDmtUIPlugin } from '@dmt/common'
import PreviewPlugin from './PreviewPlugin'

const PluginComponent = (props: IDmtUIPlugin) => {
  return (
    <PreviewPlugin
      documentId={props.documentId}
      dataSourceId={props.dataSourceId}
    />
  )
}

export const plugins: any = [
  {
    pluginName: 'default-preview',
    pluginType: DmtPluginType.UI,
    component: PluginComponent,
  },
]
