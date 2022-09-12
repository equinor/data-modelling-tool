import React from 'react'

import { EDmtPluginType, DmtUIPlugin } from '@data-modelling-tool/core'
import PreviewPlugin from './PreviewPlugin'

const PluginComponent = (props: DmtUIPlugin) => {
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
    pluginType: EDmtPluginType.UI,
    component: PluginComponent,
  },
]
