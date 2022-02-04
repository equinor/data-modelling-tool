import * as React from 'react'

import { DmtPluginType } from '@dmt/common'
import { EditSimaTask } from './EditSimaTask'

export const plugins: any = [
  {
    pluginName: 'edit-sima-task',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditSimaTask,
    },
  },
]
