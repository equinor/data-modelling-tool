import * as React from 'react'

import { EDmtPluginType, DmtUIPlugin } from '@dmt/common'

export const pluginName = 'ui-plugin-template'
export const pluginType = EDmtPluginType.UI

export const PluginComponent = (props: DmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  return (
    <div>
      Plugin content goes here!
      <p>documentId: {documentId}</p>
      <p>dataSourceId: {dataSourceId}</p>
    </div>
  )
}
