import * as React from 'react'

import { DmtPluginType } from '@dmt/common'
import { EditAzureContainer } from './EditAzureContainer'
import { EditLocalContainer } from './EditLocalContainer'

export const plugins: any = [
  {
    pluginName: 'edit-azure-container',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditAzureContainer,
    },
  },
  {
    pluginName: 'edit-local-container-job',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditLocalContainer,
    },
  },
]
