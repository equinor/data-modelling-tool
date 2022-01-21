import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/common'

export const pluginName = 'ui-plugin-template'
export const pluginType = DmtPluginType.UI

export const PluginComponent = (props: DmtUIPlugin) => {
  return <div>Plugin content goes here!</div>
}
