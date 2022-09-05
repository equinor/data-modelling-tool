import * as React from 'react'

import { useDocument } from '@dmt/common'
import { DmtPluginType, IDmtUIPlugin } from '@dmt/common'

import { DMTBluePrintTableView } from './dmt/views/DMTBluePrintTableView'

import { SIMOSRawView } from './simos/views/SIMOSRawView'

export const plugins: any = [
  //********************************************************
  //DMT forms
  //********************************************************
  {
    pluginName: 'dmt-blueprint-table-view',
    pluginType: DmtPluginType.UI,
    component: DMTBluePrintTableView,
  },
  //********************************************************
  //simos forms
  //********************************************************
  {
    pluginName: 'simos-raw-view',
    pluginType: DmtPluginType.UI,
    component: SIMOSRawView,
  },
  //********************************************************
  //********************************************************
]
