import * as React from 'react'

import { DmtPluginType } from '@dmt/common'
import { EditSimaApplicationInput } from './EditSimaApplicationInput'

export const plugins: any = [
  {
    pluginName: 'edit-sima-application-input',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditSimaApplicationInput,
    },
  },
]
