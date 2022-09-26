import * as React from 'react'

import { EDmtPluginType, IDmtUIPlugin } from '@development-framework/dm-core'

export const pluginName = 'ui-plugin-template'
export const pluginType = EDmtPluginType.UI

export const PluginComponent = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId } = props
  return (
    <div>
      Plugin content goes here!
      <p>documentId: {documentId}</p>
      <p>dataSourceId: {dataSourceId}</p>
    </div>
  )
}
