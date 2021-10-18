import React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/core-plugins'
import PreviewPlugin from './PreviewPlugin'

const PluginComponent = (props: DmtUIPlugin) => {
  return (
    <PreviewPlugin document={props.document} uiRecipe={props.uiRecipeName} />
  )
}

export const plugins: any = [
  {
    pluginName: 'default-preview',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]
