import * as React from 'react'

import { DmtPluginType, DmtUIPlugin } from '@dmt/common'
import { FoRResultWrapper } from './ForecastOfResponse'

const PluginComponent = (props: DmtUIPlugin) => {
  const { document, simulationConfig, dottedId } = props
  return (
    <FoRResultWrapper
      result={document}
      simulationConfig={simulationConfig}
      dottedId={dottedId}
    />
  )
}

export const plugins: any = [
  {
    pluginName: 'for-weather-plots',
    pluginType: DmtPluginType.UI,
    content: {
      component: PluginComponent,
    },
  },
]
