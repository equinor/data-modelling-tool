import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/core-plugins'

export const pluginName = 'ui-plugin-template'
export const pluginType = DmtPluginType.UI

export const PluginComponent = (props: DmtUIPlugin) => {
  return <div>Plugin content goes here!</div>
}
