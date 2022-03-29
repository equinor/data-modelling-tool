import * as React from 'react'

import { DmtPluginType } from '@dmt/common'
import { EditContainer } from './EditContainer'

export const plugins: any = [
  {
    pluginName: 'edit-azure-container',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditContainer,
    },
  },
  {
    pluginName: 'edit-local-container-job',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditContainer,
    },
  },
]
