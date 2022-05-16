import * as React from 'react'

import { DmtPluginType } from '@dmt/common'
import { EditBlueprint } from './EditBlueprint'

export const plugins: any = [
  {
    pluginName: 'edit-blueprint',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditBlueprint,
    },
  },
]
