import * as React from 'react'

import './index.css'
import { DmtPluginType, DmtUIPlugin } from '@dmt/common'
import PreviewPlugin from './YamlPlugin'

const PluginComponent = (props: DmtUIPlugin) => {
  const { document } = props
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
