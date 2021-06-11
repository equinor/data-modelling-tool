import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/core-plugins'


const PluginComponent = (props: DmtUIPlugin) => {
  return <div>Plugin content goes here!</div>
}


export const plugins: any = [
  {
    pluginName: 'ui-plugin-template',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]
