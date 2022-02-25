import * as React from 'react'

import { DmtPluginType } from '@dmt/common'
import { EditAzureContainer } from './EditAzureContainer'

export const plugins: any = [
  {
    pluginName: 'edit-azure-container',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditAzureContainer,
    },
  },
]
