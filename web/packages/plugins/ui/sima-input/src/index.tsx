import * as React from 'react'

import { DmtPluginType } from '@dmt/common'
import { EditSimaInput } from './EditSimaInput'
import { EditReverseTask } from './EditReverseTask'
import { ViewSimaInput } from './ViewSimaInput'

export const plugins: any = [
  {
    pluginName: 'edit-sima-task',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditSimaInput,
    },
  },
  {
    pluginName: 'edit-reverse-task',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditReverseTask,
    },
  },
  {
    pluginName: 'view-sima-task',
    pluginType: DmtPluginType.UI,
    content: {
      component: ViewSimaInput,
    },
  },
]
