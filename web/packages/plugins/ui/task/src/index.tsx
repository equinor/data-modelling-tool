import * as React from 'react'

import { DmtPluginType } from '@dmt/common'
import { EditTask } from './EditTask'
import { ViewTask } from './ViewTask'

export const plugins: any = [
  {
    pluginName: 'edit-task',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditTask,
    },
  },
  {
    pluginName: 'view-task',
    pluginType: DmtPluginType.UI,
    content: {
      component: ViewTask,
    },
  },
]
