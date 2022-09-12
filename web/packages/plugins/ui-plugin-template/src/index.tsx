import * as React from 'react'

import { EDmtPluginType, DmtUIPlugin } from '@data-modelling-tool/core'

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
