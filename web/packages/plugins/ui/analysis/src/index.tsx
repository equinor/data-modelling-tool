import * as React from 'react'

import { DmtPlugin, DmtPluginType } from '@dmt/common'
import { OperatorView } from './OperatorView'
import { InspectorView } from './InspectorView'

export const plugins: DmtPlugin[] = [
  {
    pluginName: 'view-analysis-inspector',
    pluginType: DmtPluginType.UI,
    component: InspectorView,
  },
  {
    pluginName: 'view-analysis-operator',
    pluginType: DmtPluginType.UI,
    component: OperatorView,
  },
]
