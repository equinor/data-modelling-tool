import * as React from 'react'

import { DmtPluginType, IDmtUIPlugin } from '@dmt/common'

export const pluginName = 'ui-plugin-template'
export const pluginType = DmtPluginType.UI

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
