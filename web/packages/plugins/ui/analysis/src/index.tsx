import * as React from 'react'

import { DmtPlugin, DmtPluginType } from '@dmt/common'
import { OperatorView } from './OperatorView'
import { ExpertView } from './ExpertView'

export const plugins: DmtPlugin[] = [
  {
    pluginName: 'view-analysis-operator',
    pluginType: DmtPluginType.UI,
    component: OperatorView,
  },
  {
    pluginName: 'view-analysis-expert',
    pluginType: DmtPluginType.UI,
    component: ExpertView,
  },
]
