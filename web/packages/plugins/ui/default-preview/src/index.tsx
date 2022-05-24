import React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/common'
import PreviewPlugin from './PreviewPlugin'

const PluginComponent = (props: DmtUIPlugin) => {
  return <PreviewPlugin document={props.document} />
}

export const plugins: any = [
  {
    pluginName: 'default-preview',
    pluginType: DmtPluginType.UI,
    component: PluginComponent,
  },
]
