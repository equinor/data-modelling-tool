import * as React from 'react'

import { DmtPluginType } from '@dmt/common'
import { EditSimaTask } from './EditSimaTask'
import { ViewSimaTask } from './ViewSimaTask'

export const plugins: any = [
  {
    pluginName: 'edit-sima-task',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditSimaTask,
    },
  },
  {
    pluginName: 'view-sima-task',
    pluginType: DmtPluginType.UI,
    content: {
      component: ViewSimaTask,
    },
  },
]
