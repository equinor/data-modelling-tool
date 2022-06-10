import * as React from 'react'

import { DmtPlugin, DmtPluginType } from '@dmt/common'
import { EditTask } from './EditTask'
import { ViewTask } from './ViewTask'
import { EditInput } from './InputOnly'

export const plugins: DmtPlugin[] = [
  {
    pluginName: 'edit-task',
    pluginType: DmtPluginType.UI,
    component: EditTask,
  },
  {
    pluginName: 'view-task',
    pluginType: DmtPluginType.UI,
    component: ViewTask,
  },
  {
    pluginName: 'edit-task-operator',
    pluginType: DmtPluginType.UI,
    component: EditInput,
  },
]
